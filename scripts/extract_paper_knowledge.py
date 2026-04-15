#!/usr/bin/env python3
"""
论文知识点提取脚本
将 01_架构师_论文 目录下的所有论文按结构拆分为知识点
输出 SQL 导入脚本

论文结构：
- 摘要：独立知识点
- 正文：每个以 ** 开头的主题段落独立提取
- 结论：最后的总结段落（如果有）
"""

import os
import re
from pathlib import Path

PAPERS_DIR = r"d:\fjd_ai_workspace\01_架构师_论文"
OUTPUT_FILE = r"d:\fjd_ai_workspace\02_架构师_知识库\knowledge-review\supabase\import_papers.sql"

def escape_sql(text: str) -> str:
    """转义 SQL 字符串中的特殊字符"""
    if not text:
        return ""
    text = text.replace('\\', '\\\\')
    text = text.replace("'", "''")
    return text

def format_content_for_sql(content: str) -> str:
    """格式化内容为 SQL E'' 字符串"""
    escaped = escape_sql(content)
    return f"E'{escaped}'"

def extract_paper_title(filepath: str) -> str:
    """从文件路径提取论文编号和标题"""
    folder_name = os.path.basename(os.path.dirname(filepath))
    match = re.match(r'^(\d+)_(.*)', folder_name)
    if match:
        num = match.group(1).zfill(2)
        title = match.group(2)
        return num, title
    return "00", folder_name

def extract_sections(content: str) -> list:
    """提取论文各章节"""
    sections = []
    
    # 提取摘要（## 摘要 之后到 ## 正文 之前的内容）
    abstract_pattern = re.compile(r'## 摘要\s*\n+(.*?)\n+## 正文', re.DOTALL)
    abstract_match = abstract_pattern.search(content)
    if abstract_match:
        abstract = abstract_match.group(1).strip()
        sections.append({
            'type': '摘要',
            'content': abstract,
            'title_suffix': '摘要'
        })
    
    # 提取正文段落
    # 论文正文部分以 **标题** 开头，每个加粗标题后的内容为一个段落
    # 去掉开头的项目介绍段落（与摘要重复），保留核心技术段落
    
    # 找到正文开始位置
    body_start = content.find('## 正文')
    if body_start == -1:
        return sections
    
    body_content = content[body_start:]
    
    # 将正文按 ** 分割，每个 ** 开头的主题为一个段落
    # 但要排除最后的结论部分（通过项目实践我们也认识到）
    
    # 找到结论开始位置
    conclusion_keywords = '通过项目实践我们也认识到'
    conclusion_pos = body_content.find(conclusion_keywords)
    
    if conclusion_pos > 0:
        body_only = body_content[:conclusion_pos]
        conclusion_text = body_content[conclusion_pos:].split('---')[0].strip()
    else:
        body_only = body_content
        conclusion_text = None
    
    # 按 ** 分割正文段落
    # 第一段通常是项目背景（2024年4月开头的段落），跳过或合并
    parts = re.split(r'\n(?=\*\*)', body_only)
    
    current_title = None
    current_body = []
    skip_first = True  # 跳过第一段项目背景
    
    for part in parts:
        part = part.strip()
        if not part:
            continue
        
        # 检查是否以 ** 开头
        bold_match = re.match(r'^\*\*(.+?)\*\*\s*\n?', part)
        if bold_match:
            # 保存之前的段落
            if current_title and current_body and not skip_first:
                full_content = f"**{current_title}**\n\n" + "\n\n".join(current_body)
                if len(full_content) > 100:
                    sections.append({
                        'type': '正文',
                        'chapter': current_title,
                        'content': full_content,
                        'title_suffix': f"正文_{current_title}"
                    })
            
            current_title = bold_match.group(1).strip()
            # 获取标题后的内容
            rest = part[bold_match.end():].strip()
            current_body = [rest] if rest else []
            skip_first = False
        elif current_body:
            # 追加到当前段落
            current_body.append(part)
    
    # 保存最后一个段落
    if current_title and current_body and not skip_first:
        full_content = f"**{current_title}**\n\n" + "\n\n".join(current_body)
        if len(full_content) > 100:
            sections.append({
                'type': '正文',
                'chapter': current_title,
                'content': full_content,
                'title_suffix': f"正文_{current_title}"
            })
    
    # 添加结论
    if conclusion_text and len(conclusion_text) > 50:
        sections.append({
            'type': '结论',
            'content': conclusion_text,
            'title_suffix': '结论'
        })
    
    return sections

def generate_sql_entry(paper_num: str, paper_title: str, section: dict, source_file: str) -> str:
    """生成单条 SQL INSERT 语句"""
    title = f"{paper_num}_{paper_title}_{section['title_suffix']}"
    content = section['content']
    
    # 构建标签
    tags = [
        f"论文:{paper_num}_{paper_title}",
        f"结构:{section['type']}",
        "资料:论文24篇"
    ]
    if 'chapter' in section:
        tags.append(f"章节:{section['chapter']}")
    
    tags_str = "ARRAY[" + ", ".join([f"'{t}'" for t in tags]) + "]"
    
    sql = f"""('{escape_sql(title)}', 
{format_content_for_sql(content)},
{tags_str},
'[]'::jsonb,
'{escape_sql(source_file)}'
)"""
    
    return sql

def process_paper(filepath: str) -> list:
    """处理单篇论文"""
    paper_num, paper_title = extract_paper_title(filepath)
    source_file = os.path.join(os.path.basename(os.path.dirname(filepath)), "正文.md")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    sections = extract_sections(content)
    
    entries = []
    for section in sections:
        entry = generate_sql_entry(paper_num, paper_title, section, source_file)
        entries.append(entry)
    
    return entries

def main():
    """主函数"""
    papers_dir = Path(PAPERS_DIR)
    
    # 查找所有论文
    paper_files = list(papers_dir.glob("*/正文.md"))
    paper_files.sort(key=lambda x: x.parent.name)
    
    all_entries = []
    
    for paper_file in paper_files:
        print(f"处理: {paper_file.parent.name}")
        try:
            entries = process_paper(str(paper_file))
            all_entries.extend(entries)
            print(f"  -> 提取 {len(entries)} 个知识点")
        except Exception as e:
            print(f"  -> 错误: {e}")
    
    # 生成 SQL 文件
    sql_header = """-- ============================================================
-- 论文知识点导入脚本
-- 生成时间: 2026-04-15
-- 来源: 01_架构师_论文/
-- ============================================================

-- 批量插入论文知识点
INSERT INTO knowledge_points (title, content, tags, images, source_file)
VALUES
"""

    sql_body = ",\n\n".join(all_entries)
    
    sql_footer = ";"
    
    sql = sql_header + sql_body + sql_footer
    
    # 写入文件
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(sql)
    
    print(f"\n完成! 共提取 {len(all_entries)} 个知识点")
    print(f"输出文件: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()

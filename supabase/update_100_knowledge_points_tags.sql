-- ============================================================
-- 为已导入的100条知识点添加标签
-- 来源: 2026年上半年系统架构设计师重要知识点100条
-- 生成时间: 2026-04-15
-- 说明: 通过 title 匹配已存在的记录,添加标签'资料:2026上半年100条'
--       如果记录已有该标签,则跳过(避免重复)
-- ============================================================

-- ========== 第一章 系统工程与信息系统基础 ==========

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '1、信息系统的分类'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '2、专家系统【ES】'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '3、电子政务'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '4、企业集成分类'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

-- ========== 第二章 项目管理 ==========

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '5、WBS分解的基本要求'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '6、软件工具分类'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

-- ========== 第三章 软件工程 ==========

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '7、结构化开发方法'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '8、原型法开发方法'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '9、面向对象方法'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '10、面向服务的方法'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '11、原型模型'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '12、瀑布模型'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '13、敏捷开发'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '14、统一过程（UP/RUP）'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '15、基于构件的软件工程（CBSE）'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '16、构件模型要素'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '��料:2026上半年100条')
WHERE title = '17、逆向工程导出信息的四个抽象层次'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '18、逆向工程及其相关概念'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '19、净室软件工程'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '20、UML中四种事物'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '21、UML图分类'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '22、UML图关系之用例图关系'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '23、UML图关系之类图/对象图关系'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '24、数据流图DFD'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '25、系统建模方法'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '26、测试阶段划分'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '27、白盒测试'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '28、黑盒测试（功能测试）'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '29、其他软件测试方法'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '30、模块独立性的度量——聚合'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '31、模块独立性的度量——耦合'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '32、系统维护分类'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '33、软件测试与软件调试'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

-- ========== 第四章 软件架构设计 ==========

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '34、软件架构风格'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '35、云原生架构设计原则'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '36、微服务与SOA对比'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '37、SOA关键技术'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '38、微服务'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '39、MVC'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '40、三种经典缓存使用模式'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '41、边云协同的分类'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '42、负载均衡'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '43、架构视图'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '44、Redis与Memcache能力比较'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '45、Redis集群切片的常见方式'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '46、Redis分布式存储方案'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '47、Redis数据分片方案'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '48、Redis持久化'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '49、分布式系统中的CAP理论'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '50、MDA的核心模型'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '51、REST概念'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '52、ADL'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '53、基于架构的软件设计（ABSD）'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '54、架构权衡分析法（ATAM）'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '55、风险点与非风险点、敏感点与权衡点'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '56、场景的描述'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '57、开发期质量属性和运行期质量属性'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '58、常考质量属性以及代表参数和设计策略'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '59、领域驱动设计'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '60、软件架构复用'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

-- ========== 第五章 人工智能 ==========

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '61、人工智能应用场景'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '62、机器学习'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '63、AI芯片的关键特征'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

-- ========== 第六章 信息安全技术基础知识 ==========

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '64、信息安全的5个基本要素'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '65、国产密码算法'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '66、BLP模型【机密性】'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '67、Biba模型【完整性】'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '68、WPDRRC模型'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '69、被动攻击'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '70、主动攻击'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '71、访问控制类型'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '72、区块链'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '73、区块链的核心技术'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '74、区块链的关键支撑技术'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

-- ========== 第七章 系统可靠性分析与设计 ==========

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '75、可靠性测试'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '76、恢复块方法与N版本程序设计对比'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

-- ========== 第八章 计算机系统基础 ==========

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '77、性能评估'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '78、性能指标'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

-- ========== 第九章 计算机网络 ==========

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '79、TCP/IP协议簇'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '80、层次化网络设计'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

-- ========== 第十章 嵌入式系统 ==========

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '81、嵌入式系统的分类'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '82、嵌入式微处理器工作温度范围'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '83、嵌入式操作系统的定义、特点及分类'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '84、嵌入式数据库分类'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

-- ========== 第十一章 数据库系统 ==========

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '85、数据库故障与恢复'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '86、反规范化的技术手段以及优缺点'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '87、视图的优点'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '88、分表和分区'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '89、数据库设计过程'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '90、范式'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '91、封锁协议'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '92、备份'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '93、确定完整性约束'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

-- ========== 第十二章 未来信息综合技术 ==========

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '94、关系型数据库和NoSQL对比'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '95、NoSQL分类'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '96、Kappa架构与Lambda的对比'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '97、信息物理系统CPS'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '98、数字孪生生态系统'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

-- ========== 第十三章 知识产权与标准化 ==========

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '99、使用许可'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

UPDATE knowledge_points
SET tags = array_append(tags, '资料:2026上半年100条')
WHERE title = '100、知识产权分类'
  AND NOT tags @> ARRAY['资料:2026上半年100条'];

-- ============================================================
-- 更新完成
-- ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, ChevronLeft, Lightbulb, RotateCcw } from 'lucide-react';
import { getPaperProgress, updatePaperProgress, PaperProgress } from '@/lib/api';

// 论文闯关数据 - 24关
const levels = [
  { id: 1, title: "微服务架构", scene: "视频监控业务快速迭代需求，单体架构代码耦合、维护困难", theme: "微服务架构及其应用", tech: "服务拆分、API网关、服务注册发现、容器化部署、K8s编排", practice: "拆分为设备接入/流媒体/存储/AI分析/告警/用户 6个服务，K8s弹性扩缩容" },
  { id: 2, title: "分布式系统", scene: "海量视频流高并发处理，边缘-中心二级部署架构", theme: "分布式系统设计及应用", tech: "CAP定理、BASE理论、负载均衡、Redis缓存、读写分离、故障转移", practice: "边缘节点预处理+中心端弹性扩展，Redis多级缓存，数据库一主两从" },
  { id: 3, title: "系统安全", scene: "跨厂商设备统一接入，需鉴别设备身份、控制用户权限、保护视频数据安全", theme: "系统安全架构设计及其应用", tech: "鉴别框架、访问控制框架（RBAC）、加密传输（TLS）、PKI/数字证书、安全审计", practice: "设备证书双向认证、用户RBAC权限管理、视频流TLS加密、审计日志" },
  { id: 4, title: "云原生架构", scene: "视频流峰值波动大（如高峰期/异常事件），需弹性扩缩容", theme: "云原生架构及其应用", tech: "容器化（Docker）、K8s容器编排、自动弹性伸缩（HPA）、服务网格（Service Mesh）", practice: "Docker镜像打包微服务，K8s根据CPU/并发数自动扩缩，视频流服务高峰扩容3倍" },
  { id: 5, title: "分布式事务", scene: "告警规则配置涉及设备绑定、服务更新、消息通知多服务操作，需保证一致性", theme: "分布式事务及其解决方案", tech: "2PC/3PC、TCC补偿事务、Saga长事务、本地消息表、最终一致性", practice: "采用Seata AT模式管理告警配置变更，设备变更与规则更新在同一事务中完成" },
  { id: 6, title: "软件架构风格", scene: "系统需同时满足高并发接入与业务灵活扩展", theme: "软件架构风格", tech: "分层架构、事件驱动架构（EDA）、管道过滤器、微内核架构", practice: "采用分层+事件驱动混合：接入层分层，解耦层采用事件驱动（Kafka消息总线）" },
  { id: 7, title: "SOA面向服务", scene: "跨厂商摄像头协议异构（GB28181/RTSP/ONVIF），需统一接入", theme: "面向服务架构设计及其应用", tech: "ESB企业服务总线、Web服务、WSDL/SOAP、UDDI服务注册、服务编排", practice: "ESB总线统一协议转换，不同品牌设备通过适配器接入，统一对外提供服务接口" },
  { id: 8, title: "软件可靠性", scene: "7×24小时运行，关键告警不能丢失", theme: "软件的可靠性设计", tech: "容错设计（恢复块、N版本程序）、冗余设计、检错技术、降低复杂度设计", practice: "告警服务N版本冗余部署，边缘节点本地缓存，网络中断时本地告警暂存" },
  { id: 9, title: "多源数据集成", scene: "视频文件（非结构化）+设备元数据（结构化）+告警日志（半结构化）统一管理", theme: "多源数据集成方法及其应用", tech: "ETL、数据仓库、数据湖、湖仓一体（Lakehouse）、实时流处理（Kafka+Flink）", practice: "视频存储HDFS，结构化数据存入MySQL，日志存入ElasticSearch，Kafka+Flink实时分析" },
  { id: 10, title: "事件驱动架构", scene: "异常事件触发多系统联动（告警+录像+通知）", theme: "事件驱动架构及其应用", tech: "发布/订阅模式、消息中间件（Kafka）、事件溯源、CQRS读写分离", practice: "Kafka主题分区，设备事件发布到对应主题，消费端按需订阅，录像服务+通知服务联动" },
  { id: 11, title: "NoSQL数据库", scene: "海量告警日志、时序视频质量数据存储", theme: "NoSQL数据库技术及其应用", tech: "Key-Value（Redis）、列存储（HBase）、文档型（MongoDB）、图数据库（Neo4j）、CAP权衡", practice: "Redis缓存设备状态，MongoDB存储告警记录，InfluxDB存储时序数据" },
  { id: 12, title: "负载均衡算法", scene: "多用户同时访问视频流，负载不均导致卡顿", theme: "负载均衡算法及其应用", tech: "轮询、随机、加权、最小连接数、动态反馈、一致性哈希", practice: "Nginx/LVS七层负载均衡，Sentinel动态权重调整，视频流按区域哈希分发" },
  { id: 13, title: "单元测试", scene: "微服务独立部署后，需保证各服务质量", theme: "单元测试方法及其应用", tech: "静态测试（JTest）、动态测试、白盒/黑盒测试、Mock框架、覆盖率分析", practice: "JUnit+Mockito单元测试，Jacoco覆盖率统计，GitLab CI流水线集成" },
  { id: 14, title: "系统自动化测试", scene: "微服务频繁发布，需自动化回归验证", theme: "系统自动化测试及其应用", tech: "自动化测试框架（Selenium/Appium）、持续集成（Jenkins）、接口测试、性能测试", practice: "Postman接口自动化，JMeter性能测试，Jenkins流水线自动化部署+测试" },
  { id: 15, title: "软件维护", scene: "系统上线后持续迭代，需控制维护成本", theme: "软件维护方法及其应用", tech: "改正性/适应性/完善性/预防性维护、可维护性度量、回归测试", practice: "完善性维护持续迭代AI算法，适应性维护适配新品牌设备，完善性维护增加历史视频检索功能" },
  { id: 16, title: "云上自动化运维", scene: "7×24小时运维，需降低人工干预", theme: "云上自动化运维及其应用", tech: "CloudOps五维能力（自动化/弹性/高可用/安全/成本）、IaC基础设施即代码、Ansible/SaltStack", practice: "Terraform编排基础设施，Ansible批量配置，Prometheus+Grafana监控告警" },
  { id: 17, title: "基于构件的软件工程", scene: "跨项目复用视频播放、录像回放等通用能力", theme: "基于构件的软件工程及其应用", tech: "构件标准（COSML）、构件组装（顺序/层次/叠加）、适配器模式、构件注册", practice: "封装视频播放构件、录像回放构件，通过适配器接入不同前端框架，版本管理" },
  { id: 18, title: "RUP软件开发", scene: "复杂项目需分阶段管理，降低风险", theme: "RUP软件开发过程及其应用", tech: "四阶段（初始/细化/构建/交付）、用例驱动、以架构为中心、迭代增量开发", practice: "初始阶段确定需求，细化阶段设计架构，构建阶段迭代开发，交付阶段部署上线" },
  { id: 19, title: "ABSD架构设计", scene: "系统架构需系统化设计，避免架构腐化", theme: "基于架构的软件设计方法及其应用", tech: "架构需求→设计→文档化→复审→实现→演化，六阶段循环", practice: "架构需求定义功能/质量/约束，架构设计产出架构文档，复审后进入实现" },
  { id: 20, title: "数据湖架构", scene: "需统一管理视频原始文件与业务结构化数据", theme: "数据湖架构及其应用", tech: "数据湖（Delta Lake/Iceberg）、Schema演进、流批一体、数据治理", practice: "视频文件入HDFS数据湖，Kafka实时入湖，Flink批处理分析，Presto统一查询" },
  { id: 21, title: "DevOps", scene: "需加快交付速度，减少人工发布风险", theme: "DevOps及其应用", tech: "CI/CD流水线、GitOps、容器镜像仓库、灰度发布、蓝绿部署", practice: "GitLab CI + Argo CD实现GitOps，容器镜像Helm Chart管理，Argo Rollouts灰度发布" },
  { id: 22, title: "Serverless架构", scene: "低频AI分析任务（如违规检测），无需常驻服务", theme: "Serverless架构及其应用", tech: "FaaS函数即服务、BaaS后端即服务、冷启动优化、事件驱动执行", practice: "AI分析函数部署阿里云函数计算，摄像头异常事件触发函数执行，按调用计费" },
  { id: 23, title: "模型驱动架构", scene: "多平台适配（Windows/Linux/Web/APP），避免重复编码", theme: "模型驱动架构及其应用", tech: "PIM/PSM模型分离、UML建模、代码自动生成（Acceleo/EMF）、模型版本管理", practice: "设备模型/告警模型PIM，EMF转换生成Java/Python/Swift多端代码，核心逻辑复用" },
  { id: 24, title: "区块链技术", scene: "关键告警数据需防篡改，跨机构数据共享", theme: "区块链技术及其应用", tech: "分布式账本、共识机制（PoW/PoS）、智能合约、六层模型（数据层/网络层/共识层/激励层/合约层/应用层）", practice: "告警数据哈希上链存证，跨园区视频监控数据共享联盟链，智能合约自动执行告警核实" }
];

type GameMode = 'game' | 'flash';

export default function PaperPage() {
  const [progress, setProgress] = useState<Map<number, PaperProgress>>(new Map());
  const [currentLevel, setCurrentLevel] = useState(0);
  const [mode, setMode] = useState<GameMode>('game');
  const [selected, setSelected] = useState<{ theme: string | null; tech: string | null; practice: string | null }>({
    theme: null,
    tech: null,
    practice: null,
  });
  const [result, setResult] = useState<{ correct: number; isPassed: boolean } | null>(null);
  const [flashCardFlipped, setFlashCardFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    try {
      const data = await getPaperProgress();
      const map = new Map<number, PaperProgress>();
      data.forEach(p => map.set(p.level_id, p));
      setProgress(map);
    } catch (error) {
      console.error('加载进度失败:', error);
    } finally {
      setLoading(false);
    }
  }

  const currentLevelData = levels[currentLevel];
  const completedCount = levels.filter(l => progress.get(l.id)?.status === 'completed').length;
  const weakLevels = levels.filter(l => progress.get(l.id)?.status === 'forgotten');
  const progressPercent = (completedCount / levels.length) * 100;

  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const getOtherOptions = (type: 'theme' | 'tech' | 'practice', correct: string) => {
    return levels.map(l => l[type]).filter(o => o !== correct).slice(0, 3);
  };

  const shuffledThemes = shuffle([currentLevelData.theme, ...getOtherOptions('theme', currentLevelData.theme)]);
  const shuffledTechs = shuffle([currentLevelData.tech, ...getOtherOptions('tech', currentLevelData.tech)]);
  const shuffledPractices = shuffle([currentLevelData.practice, ...getOtherOptions('practice', currentLevelData.practice)]);

  const selectOption = (dim: 'theme' | 'tech' | 'practice', value: string) => {
    setSelected(prev => ({ ...prev, [dim]: value }));
  };

  const checkAnswer = async () => {
    let correct = 0;

    if (selected.theme && currentLevelData.theme.includes(selected.theme.substring(0, 10))) correct++;
    if (selected.tech && currentLevelData.tech.split('、').some(t => selected.tech!.includes(t))) correct++;
    if (selected.practice && currentLevelData.practice.includes(selected.practice.substring(0, 10))) correct++;

    const isPassed = correct >= 2;
    setResult({ correct, isPassed });

    await updatePaperProgress(currentLevelData.id, {
      status: isPassed ? 'completed' : 'forgotten',
      wrong_count: isPassed ? 0 : 1,
    });
    await loadProgress();
  };

  const startLevel = (index: number) => {
    setCurrentLevel(index);
    setSelected({ theme: null, tech: null, practice: null });
    setResult(null);
    setShowHint(false);
  };

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      startLevel(currentLevel + 1);
    } else {
      startLevel(0);
    }
  };

  const prevLevel = () => {
    if (currentLevel > 0) {
      startLevel(currentLevel - 1);
    }
  };

  const flipCard = () => {
    setFlashCardFlipped(prev => !prev);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span>返回首页</span>
            </Link>
            <h1 className="text-xl font-bold text-indigo-400">论文场景闯关</h1>
          </div>
          <div className="text-slate-400 text-sm">
            已完成 {completedCount}/{levels.length} 关
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 进度条 */}
        <div className="mb-6">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 模式切换 */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setMode('game')}
            className={`px-6 py-2 rounded-full transition-all ${
              mode === 'game'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            闯关模式
          </button>
          <button
            onClick={() => setMode('flash')}
            className={`px-6 py-2 rounded-full transition-all ${
              mode === 'flash'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            记忆卡片
          </button>
        </div>

        {/* 关卡列表 */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-8">
          {levels.map((level, index) => {
            const p = progress.get(level.id);
            const isCompleted = p?.status === 'completed';
            const isForgotten = p?.status === 'forgotten';
            const isCurrent = index === currentLevel && mode === 'game';

            return (
              <button
                key={level.id}
                onClick={() => startLevel(index)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  isCompleted
                    ? 'border-green-500 bg-green-900/30'
                    : isForgotten
                    ? 'border-amber-500 bg-amber-900/30'
                    : 'border-slate-600 bg-slate-800 hover:border-indigo-400'
                } ${isCurrent ? 'ring-2 ring-indigo-400' : ''}`}
              >
                <div className={`text-lg font-bold ${isCompleted ? 'text-green-400' : 'text-indigo-400'}`}>
                  {String(level.id).padStart(2, '0')}
                </div>
                <div className="text-xs text-slate-400 truncate mt-1">{level.title}</div>
              </button>
            );
          })}
        </div>

        {/* 闯关游戏区 */}
        {mode === 'game' && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-indigo-400">
                第{currentLevelData.id}关：{currentLevelData.title}
              </h2>
              <div className="flex gap-2">
                <button onClick={prevLevel} disabled={currentLevel === 0} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextLevel} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* 四维卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 场景 */}
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-xs text-slate-400 uppercase mb-2">场景</div>
                <div className="text-white font-medium">{currentLevelData.scene}</div>
              </div>

              {/* 主题 */}
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-xs text-slate-400 uppercase mb-2">主题</div>
                <div className="flex flex-wrap gap-2">
                  {shuffledThemes.map((theme, i) => (
                    <button
                      key={i}
                      onClick={() => selectOption('theme', theme)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                        selected.theme === theme
                          ? theme === currentLevelData.theme
                            ? 'border-green-500 bg-green-900/50'
                            : 'border-red-500 bg-red-900/50'
                          : 'border-slate-500 bg-slate-600 hover:border-indigo-400'
                      }`}
                    >
                      {theme.length > 20 ? theme.substring(0, 20) + '...' : theme}
                    </button>
                  ))}
                </div>
              </div>

              {/* 技术 */}
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-xs text-slate-400 uppercase mb-2">技术</div>
                <div className="flex flex-wrap gap-2">
                  {shuffledTechs.map((tech, i) => (
                    <button
                      key={i}
                      onClick={() => selectOption('tech', tech)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                        selected.tech === tech
                          ? currentLevelData.tech.includes(tech.substring(0, 10))
                            ? 'border-green-500 bg-green-900/50'
                            : 'border-red-500 bg-red-900/50'
                          : 'border-slate-500 bg-slate-600 hover:border-indigo-400'
                      }`}
                    >
                      {tech.length > 15 ? tech.substring(0, 15) + '...' : tech}
                    </button>
                  ))}
                </div>
              </div>

              {/* 实践 */}
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-xs text-slate-400 uppercase mb-2">实践</div>
                <div className="flex flex-wrap gap-2">
                  {shuffledPractices.map((practice, i) => (
                    <button
                      key={i}
                      onClick={() => selectOption('practice', practice)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                        selected.practice === practice
                          ? currentLevelData.practice.includes(practice.substring(0, 10))
                            ? 'border-green-500 bg-green-900/50'
                            : 'border-red-500 bg-red-900/50'
                          : 'border-slate-500 bg-slate-600 hover:border-indigo-400'
                      }`}
                    >
                      {practice.length > 15 ? practice.substring(0, 15) + '...' : practice}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 结果反馈 */}
            {result && (
              <div className={`mt-6 p-4 rounded-lg ${result.isPassed ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                <div className="flex items-center gap-3">
                  {result.isPassed ? (
                    <>
                      <CheckCircle2 className="text-green-400" size={24} />
                      <span className="text-green-400 font-medium">
                        正确！ {result.correct}/3 {result.correct === 3 ? '🎉' : ''}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-400" size={24} />
                      <span className="text-red-400 font-medium">再接再厉 {result.correct}/3</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => setShowHint(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-600 hover:bg-slate-500 transition-colors"
              >
                <Lightbulb size={18} />
                提示
              </button>
              <button
                onClick={checkAnswer}
                disabled={!selected.theme || !selected.tech || !selected.practice || result !== null}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle2 size={18} />
                验证答案
              </button>
              {result && (
                <button
                  onClick={nextLevel}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 transition-colors"
                >
                  下一关
                  <ChevronRight size={18} />
                </button>
              )}
            </div>

            {/* 提示弹窗 */}
            {showHint && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowHint(false)}>
                <div className="bg-slate-800 rounded-xl p-6 max-w-md mx-4 border border-slate-600" onClick={e => e.stopPropagation()}>
                  <h3 className="text-lg font-bold text-amber-400 mb-4">提示</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-slate-400">主题关键词：</span>{currentLevelData.theme}</p>
                    <p><span className="text-slate-400">技术关键词：</span>{currentLevelData.tech.split('、')[0]}</p>
                    <p><span className="text-slate-400">实践关键词：</span>{currentLevelData.practice.substring(0, 30)}...</p>
                  </div>
                  <button
                    onClick={() => setShowHint(false)}
                    className="mt-4 w-full py-2 rounded-lg bg-slate-600 hover:bg-slate-500 transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 记忆卡片模式 */}
        {mode === 'flash' && (
          <div className="text-center">
            <div
              onClick={flipCard}
              className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-10 min-h-[300px] cursor-pointer flex flex-col justify-center items-center border border-slate-600"
            >
              {!flashCardFlipped ? (
                <div className="text-2xl text-indigo-400">{currentLevelData.scene}</div>
              ) : (
                <div className="text-left space-y-4">
                  <div>
                    <span className="text-slate-400">主题：</span>
                    <span className="text-green-400">{currentLevelData.theme}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">技术：</span>
                    <span className="text-green-400">{currentLevelData.tech}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">实践：</span>
                    <span className="text-green-400">{currentLevelData.practice}</span>
                  </div>
                </div>
              )}
            </div>
            <p className="text-slate-400 text-sm mt-4">点击卡片翻转</p>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => { prevLevel(); setFlashCardFlipped(false); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                <ChevronLeft size={18} />
                上一张
              </button>
              <button
                onClick={() => { nextLevel(); setFlashCardFlipped(false); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                下一张
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* 薄弱环节 */}
        {weakLevels.length > 0 && (
          <div className="mt-8 bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
              <RotateCcw size={20} />
              薄弱环节
            </h3>
            <div className="flex flex-wrap gap-3">
              {weakLevels.map(level => (
                <button
                  key={level.id}
                  onClick={() => { setMode('game'); startLevel(level.id - 1); }}
                  className="px-4 py-2 rounded-full bg-amber-900/30 border border-amber-500 text-amber-300 hover:bg-amber-900/50 transition-colors"
                >
                  {level.id}. {level.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

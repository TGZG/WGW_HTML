/**
 * 物品数据定义文件
 * 包含所有空间内的物品数据
 */

// 空间容量信息
const spaceCapacity = {
    survival: { used: 86, total: 200 },
    battle: { used: 17, total: 100 },
    cultivation: { used: 28, total: 150 },
    economy: { used: 1500, total: 10000 },
    industry: { used: 95, total: 200 },
    sect: { used: 0, total: 50 },
    elixir: { used: 65, total: 120 },
    artifact: { used: 2, total: 20 },
    skill: { used: 9, total: 30 }
};

// 各区域物品数据
const itemData = {
    survival: [
        { 
            name: "灵草", 
            count: 23, 
            image: "/api/placeholder/64/64",
            type: "基础材料",
            quality: "common",
            description: "生长在灵气充沛地区的草本植物，可作为炼丹的材料或食用恢复少量体力。"
        },
        { 
            name: "木头", 
            count: 48, 
            image: "/api/placeholder/64/64",
            type: "建材",
            quality: "common",
            description: "寻常树木砍伐而得，可用于搭建简易住所或制作工具。"
        },
        { 
            name: "种子", 
            count: 15, 
            image: "/api/placeholder/64/64",
            type: "种植材料",
            quality: "common",
            description: "可种植在肥沃土壤中，生长出各种植物。"
        }
    ],
    battle: [
        { 
            name: "太清阁长剑", 
            count: 1, 
            image: "/api/placeholder/64/64",
            type: "武器",
            quality: "uncommon",
            description: "太清阁出品的标准练气期修士武器，适合初学者使用。剑身可以附着灵气增强攻击效果，对付普通敌人绰绰有余。",
            isLongSword: true
        },
        { 
            name: "软甲", 
            count: 1, 
            image: "/api/placeholder/64/64",
            type: "防具",
            quality: "uncommon",
            description: "轻薄柔韧的护甲，可减轻物理伤害，不影响行动速度。"
        },
        { 
            name: "传送符", 
            count: 3, 
            image: "/api/placeholder/64/64",
            type: "符箓",
            quality: "rare",
            description: "激活后可传送到指定地点，是遭遇危险时脱身的关键道具。"
        },
        { 
            name: "疗伤丹", 
            count: 5, 
            image: "/api/placeholder/64/64",
            type: "战斗丹药",
            quality: "uncommon",
            description: "缓慢恢复伤势，适合战斗结束后服用。"
        },
        { 
            name: "聚灵丹", 
            count: 7, 
            image: "/api/placeholder/64/64",
            type: "战斗丹药",
            quality: "uncommon",
            description: "能够短时间内聚集周围灵气，提升修士灵气恢复速度。"
        }
    ],
    cultivation: [
        { 
            name: "妖血", 
            count: 3, 
            image: "/api/placeholder/64/64",
            type: "修炼材料",
            quality: "rare",
            description: "妖兽的精血，含有丰富的能量，可辅助修炼。"
        },
        { 
            name: "凡品灵石", 
            count: 25, 
            image: "/api/placeholder/64/64",
            type: "修炼资源",
            quality: "rare",
            description: "蕴含灵气的石头，是修士必备的修炼资源。"
        }
    ],
    economy: [
        { 
            name: "金币", 
            count: 1500, 
            image: "/api/placeholder/64/64",
            type: "货币",
            quality: "common",
            description: "通用货币，可在大部分地区流通使用。"
        }
    ],
    industry: [
        { 
            name: "铁矿石", 
            count: 32, 
            image: "/api/placeholder/64/64",
            type: "矿物材料",
            quality: "common",
            description: "含铁的矿石，冶炼后可得到纯铁。"
        },
        { 
            name: "金矿石", 
            count: 15, 
            image: "/api/placeholder/64/64",
            type: "矿物材料",
            quality: "uncommon",
            description: "含金的矿石，冶炼后可得到纯金。"
        },
        { 
            name: "白星矿石", 
            count: 8, 
            image: "/api/placeholder/64/64",
            type: "矿物材料",
            quality: "rare",
            description: "罕见的矿石，冶炼后可得到星金，是高级法器的主要材料。"
        },
        { 
            name: "镜璃矿石", 
            count: 3, 
            image: "/api/placeholder/64/64",
            type: "矿物材料",
            quality: "epic",
            description: "极为珍贵的矿石，冶炼后可得到镜璃，具有特殊的空间属性。"
        }
    ],
    sect: [],
    elixir: [
        { 
            name: "培元丹", 
            count: 5, 
            image: "/api/placeholder/64/64",
            type: "修炼丹药",
            quality: "uncommon",
            description: "增强修士体质，为修炼奠定基础。"
        },
        { 
            name: "百病不生丹", 
            count: 3, 
            image: "/api/placeholder/64/64",
            type: "辅助丹药",
            quality: "uncommon",
            description: "服用后可增强体质，百日内不受常见疾病侵扰。"
        }
    ],
    artifact: [
        { 
            name: "灵笼", 
            count: 2, 
            image: "/api/placeholder/64/64",
            type: "工具法宝",
            quality: "rare",
            description: "拥有两个实体，大小与形状相同、为笼子形状。使用灵笼互换术可实现矿石开采。"
        }
    ],
    skill: [
        { 
            name: "剑斩术", 
            count: 1, 
            image: "/api/placeholder/64/64",
            type: "剑法",
            quality: "uncommon",
            description: "基础剑法，凝聚灵气于剑刃，提升斩击威力。"
        },
        { 
            name: "横扫术", 
            count: 1, 
            image: "/api/placeholder/64/64",
            type: "剑法",
            quality: "uncommon",
            description: "横向挥动兵器，适合对付多个弱小敌人。"
        },
        { 
            name: "飞剑术", 
            count: 1, 
            image: "/api/placeholder/64/64",
            type: "御剑术",
            quality: "rare",
            description: "控制飞剑远程攻击敌人，是剑修常用的进阶剑法。"
        }
    ]
};
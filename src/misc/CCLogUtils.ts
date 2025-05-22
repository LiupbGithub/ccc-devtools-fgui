// @ts-nocheck
export class CCLogUtils {
        /**
     * 检查是否有UITransform组件 针对的是UI组件
     */
    public static getUITransform(node: Node): UITransform {
        let transform = node.getComponent(UITransform);
        if (!transform) {
            WARN("节点没有UITransform组件, 默认自动添加，人工确实是否需要：", node.name);
            transform = node.addComponent(UITransform);
            return transform;
        }
        return transform;
    }
    static init() {
        if (cc.cache) return;
        // cc.tree = function (key) {
        //     let index = key || 0;
        //     let treeNode = function (node) {
        //         let nameStyle =
        //             `color: ${node.parent === null || node.activeInHierarchy ? 'green' : 'grey'}; font-size: 14px;font-weight:bold`;
        //         let propStyle =
        //             `color: black; background: lightgrey;margin-left: 5px;border-radius:3px;padding: 0 3px;font-size: 10px;font-weight:bold`;
        //         let indexStyle =
        //             `color: orange; background: black;margin-left: 5px;border-radius:3px;padding:0 3px;fonrt-size: 10px;font-weight:bold;`
        //         let nameValue = `%c${node.name}`;
        //         let propValue =
        //             `%c${node.x + ',' + node.y + ',' + CCLogUtils.getUITransform(node).width + ',' + CCLogUtils.getUITransform(node).height + ',' + node.scale}`
        //         let indexValue = `%c${index++}`;
        //         let childCount = node.children.length;
        //         if (childCount > 0) {
        //             console.groupCollapsed(nameValue + propValue + indexValue, nameStyle,
        //                 propStyle, indexStyle);
        //             for (let i = 0; i < childCount; i++) {
        //                 treeNode(node.children[i]);
        //             }
        //             console.groupEnd();
        //         } else {
        //             console.log(nameValue + propValue + indexValue, nameStyle, propStyle,
        //                 indexStyle);
        //         }
        //     }
        //     if (key) {
        //         let node = cc.cat(key);
        //         index = node['tempIndex'];
        //         treeNode(node);
        //     } else {
        //         let scene = cc.director.getScene();
        //         treeNode(scene);
        //     }
        //     return '属性依次为x,y,width,height,scale.使用cc.cat(id)查看详细属性.';
        // }
        // cc.cat = function (key) {
        //     let index = 0;
        //     let target;
        //     let sortId = function (node) {
        //         if (target) return;
        //         if (cc.js.isNumber(key)) {
        //             if (key === index++) {
        //                 target = node;
        //                 return;
        //             }
        //         } else {
        //             if (key.toLowerCase() === node.name.toLowerCase()) {
        //                 target = node;
        //                 return;
        //             } else {
        //                 index++;
        //             }
        //         }
        //         let childCount = node.children.length;
        //         if (childCount > 0) {
        //             for (let i = 0; i < childCount; i++) {
        //                 sortId(node.children[i]);
        //             }
        //         }
        //     }
        //     let scene = cc.director.getScene();
        //     sortId(scene);
        //     target['tempIndex'] = cc.js.isNumber(key) ? key : index;
        //     return target;
        // }
        // cc.list = function (key) {
        //     let targets = [];
        //     let step = function (node) {
        //         if (node.name.toLowerCase().indexOf(key.toLowerCase()) > -1) {
        //             targets.push(node);
        //         }
        //         let childCount = node.children.length;
        //         if (childCount > 0) {
        //             for (let i = 0; i < childCount; i++) {
        //                 step(node.children[i]);
        //             }
        //         }
        //     }
        //     let scene = cc.director.getScene();
        //     step(scene);
        //     if (targets.length === 1) {
        //         return targets[0];
        //     } else {
        //         return targets;
        //     }
        // }
        // cc.where = function (key) {
        //     let target = key.name ? key : cc.cat(key);
        //     if (!target) {
        //         return null;
        //     }
        //     let rect = target.getBoundingBoxToWorld();
        //     let bgNode = new cc.Node();
        //     let graphics = bgNode.addComponent(cc.Graphics);
        //     let scene = cc.director.getScene();
        //     scene.addChild(bgNode);
        //     bgNode.position = rect.center;
        //     bgNode.group = target.group;
        //     bgNode.zIndex = cc.macro.MAX_ZINDEX;
        //     let isZeroSize = rect.width === 0 || rect.height === 0;
        //     if (isZeroSize) {
        //         graphics.circle(0, 0, 100);
        //         graphics.fillColor = cc.Color.GREEN;
        //         graphics.fill();
        //     } else {
        //         let tran = CCLogUtils.getUITransform(bgNode);
        //         tran.width = rect.width;
        //         tran.height = rect.height;
        //         graphics.rect(-tran.width / 2, -tran.height / 2, tran.width, tran.height);
        //         graphics.fillColor = new cc.Color().fromHEX('#E91E6390');
        //         graphics.fill();
        //     }
        //     setTimeout(() => {
        //         if (cc.isValid(bgNode)) {
        //             bgNode.destroy();
        //         }
        //     }, 2000);
        //     return target;
        // }
        cc.cache = function () {
            let rawCacheData = cc.assetManager.assets._map;
            let cacheData = [];
            let totalTextureSize = 0;

            let getTexName = function (uuidHead) {
                let name = '';
                for (let k in rawCacheData){
                    const element = rawCacheData[k];
                    let content = element.__classname__;
                    if (element._uuid.indexOf(uuidHead) > -1 && content === "cc.SpriteFrame") {
                        name = element.name;
                        break;
                    }
                }
                return name;
            }

            for (let k in rawCacheData) {
                let item = rawCacheData[k];
                if (item.type !== 'js' && item.type !== 'json') {
                    let itemName = '_';
                    let preview = '';
                    let format = item._native;
                    let content = item.__classname__;
                    let formatSize = -1;
                    let assetBundle = '';
                    if (item.type === 'png' || item.type === 'jpg') {
                        let texture = rawCacheData[k.replace('.' + item.type, '.json')];
                        if (texture && texture._owner && texture._owner._name) {
                            itemName = texture._owner._name;
                            preview = texture.content.url;
                        }
                    } else {
                        if (item.name) {
                            itemName = item.name;
                        } else if (item._owner) {
                            itemName = (item._owner && item._owner.name) || '_';
                        }
                        if (content === 'cc.ImageAsset') {
                            preview = item.nativeUrl;
                            assetBundle = preview?.split('/')[1]??'';
                            let bundle = cc.assetManager.getBundle(assetBundle) ?? cc.resources;
                            let uuidHead = item._uuid.split('@')[0];
                            format = item._native;
                            itemName = getTexName(uuidHead);
                            let info = bundle.getAssetInfo(item._uuid)
                            if (info) {
                                itemName = info.path
                            }else if (item._uuid.indexOf("remoteAssets") > -1){
                                let uuids = item._uuid.split('/');
                                let names = uuids[uuids.length-1].split("?")[0];
                                itemName = names.split('.')[0];
                                format = '.'+ names.split('.')[1];
                            }else{
                                console.log("未找到图片名称:",assetBundle, preview);
                            }
                            let textureSize = item.width * item.height * ((item._native === '.jpg' ? 3 : 4) / 1024 / 1024);
                            totalTextureSize += textureSize;
                            formatSize = Math.round(textureSize * 1000) / 1000;
                           
                        }
                    }
    
                    cacheData.push({
                        assetBundle: assetBundle,
                        name: itemName,
                        type: content,
                        format: format,
                        id: item._uuid,
                        size: formatSize+"M"
                    });
                }
            }

            cacheData.push({
                assetBundle: '总计',
                name: '纹理缓存',
                type: 'cc.ImageAsset',
                format: 'texture',
                id: '总计',
                size: totalTextureSize.toFixed(2) + 'M'
            });

            let cacheTitle = `缓存 [文件总数:${cacheData.length}]  [纹理缓存:${totalTextureSize.toFixed(2) + 'M'}]`;
            let result = {
                all: cacheData,
                texture: cacheData.filter((item) => {
                    return item.type === 'cc.ImageAsset';
                }
                ),
                allSize: cacheTitle,
            };
            return result;
        }
    }

    /**
     * 初始化全局变量 方便全局调用
     */
    static initGlobal() {
        window.dbug = {};
        // [Symbol(), Symbol([[setResolutionDetailMapCallback]])]
        let sys = window.System[Object.getOwnPropertySymbols(System)[0]];
        for (const key in sys) {
            if (key.includes('/chunks/')) {
                const element = sys[key];
                const module = element.C;
                if (!module) continue;
                for (const key in module) {
                    if (Object.prototype.hasOwnProperty.call(module, key)) {
                        const element = module[key];
                        let name = key;
                        if(key =="default"){
                            name = element.name;
                        }
                        window.dbug[name] = element;
                    }
                }
            }
        }
    }
}
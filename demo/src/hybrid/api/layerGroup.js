define(
    function (require) {

        /**
         * @class blend.Api.layer
         * @singleton
         * @private
         */
        var layerGroup = {};
        var devPR = window.devicePixelRatio || 2;

        
        /**
         * 通知runtime创建pagerGroup，成功回掉返回 runtime句柄winid
         *
         * @param {String} groupId id
         * @param {Array} layers 本地或网络url链接组成的Array
         * @param {Object} options pager数组
         * @returns null
         * @private
         */

        layerGroup.create = function(groupId, layers, options){
            var layerInfo = {
                id: groupId||uniqid(),
                infos:layers
            };
            if(options.active) layerInfo.active = options.active;
            var groupOptions = {};
            
            //过滤没用字段;
            ['left','top','width','height'].forEach(function(n,i){
                if(options[n]!==undefined){
                    groupOptions[n] = options[n]*devPR;
                }
            });
            
            window.lc_bridge.addLayerGroup(JSON.stringify(layerInfo), JSON.stringify(groupOptions));
            return groupId;
        };

        /**
         * 激活GroupId下面的对应的layerId
         * @method {Function} showLayer
         * @returns groupId
         * @private
         */
        layerGroup.showLayer = function(groupId, layerId){
            window.lc_bridge.showLayerInGroup(groupId, layerId);
            //@todo return 
            return groupId;
        };

        /**
         * 在group中增加layer
         * @private
         * @returns groupId
         */
        layerGroup.addLayer = function(groupId, layerGroup){
            window.lc_bridge.addLayerInGroup(groupId, layerGroup, index);
            //@todo return 
            return groupId;
        };
        
        /**
         * 在group中删除layer
         * @private
         * @returns groupId
         */
        layerGroup.removeLayer = function(groupId, layerId){
            window.lc_bridge.removeLayerInGroup(groupId, layerId);
            //@todo return 
            return groupId;
        };
        
        /**
         * 在group中更新layer
         * @private
         * @returns groupId
         */
        layerGroup.updateLayer = function(groupId, layerId, layerOptions){
            window.lc_bridge.updateLayerInGroup(groupId, layerId, layerOptions);
            //@todo return 
            return groupId;
        };
        
        return layerGroup;

    }
);
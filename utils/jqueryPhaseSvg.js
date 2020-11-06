import jQuery from 'jquery'
/*eslint-disable */      //  有些插件写的可能比较早没有代码检查，这里可以禁用一下，避免报错。
(function ($) {
    var __DEF__ = {
        // triggerEvent: "click",
        dataSourse: "",//数据源
        // dom: "PhaseSvg",//当前dom 元素
        cd_data: {
            phase_plan_id: null,
            phase_status: null,
            phase_name: null,
            time: null,
            inter_id: null,
        },
        nowPhaseName:'',
        domStr:'',
        url: '',
        svgFont: { "fontFill": "#708090", "fontStroke": "black", "fontSize": "18px", "fontWeight": "bold" },//字体样式
        signalColor: { "red": "#FF4500", "green": "#00ff12", "yellow": "#F1C40F", 'gray': '#ccc' },//箭头和线的颜色
        svgBox: { "svgSize": 210, "svgBg": "#62705e", "bgFill": "#302d34", "bgStroke": "white" },//svg盒子大小、背景色、路口填充色、路口边框色
        viewBox: "0 0 210 210",//svg 盒子的尺寸 比svgSize小时则显示的图大
    };
    var __PROP__ = {
        // 初始化功能
        _init: function () {
            // 初始化目标对象
            this.dom = $(this); // 目标元素
            var em = this.dataSourse;//数据源
            // 浮层显示SVG的table
            var tbl = '<table style="border-collapse: collapse; border: none;width:100%;">';
            // 循序显示SVG的数据个数
            for (var i = 0; i < em.data.total; i++) {
                var bg = '<svg height="' + this.svgBox.svgSize + '" viewBox="' + this.viewBox + '" style="font-size:' + this.svgFont.fontSize + '"><g> ' +
                    '<marker id="markerArrow_green" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto" markerUnits="strokeWidth" viewBox="0 0 15 15" > ' +
                    '<path d="M0,0 L0,6 L9,3 z" style="fill:' + this.signalColor.green + '"; /></marker>';
                bg += '<marker id="markerArrow_red" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto" markerUnits="strokeWidth" viewBox="0 0 15 15" > ' +
                    '<path d="M0,0 L0,6 L9,3 z" style="fill:' + this.signalColor.red + '"; /></marker>';
                bg += '<marker id="markerArrow_yellow" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto" markerUnits="strokeWidth" viewBox="0 0 15 15" > ' +
                    '<path d="M0,0 L0,6 L9,3 z" style="fill:' + this.signalColor.yellow + '"; /></marker>';
                bg += '<marker id="markerArrow_gray" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto" markerUnits="strokeWidth" viewBox="0 0 15 15" > ' +
                '<path d="M0,0 L0,6 L9,3 z" style="fill:' + this.signalColor.gray + '"; />';
                bg += '</marker>';
                bg += '<defs> <pattern id="sidewalk_v_'+this.domStr+'" patternUnits="objectBoundingBox"  width=".125" height=".25" patternContentUnits="objectBoundingBox">\
                            <rect width=".0625" height="10" x=".0312" style="fill:'+ this.signalColor.red +';stroke:#none;fill-opacity:0.8" /> </pattern>\
		           		<pattern id="sidewalk_h_'+this.domStr+'" patternUnits="objectBoundingBox"  width=".25" height=".125" patternContentUnits="objectBoundingBox">\
                        <rect height=".0625" width="10" y=".0312" style="fill:'+ this.signalColor.green +';stroke:#none;fill-opacity:0.8" /> </pattern>\
                        <pattern id="sidewalk_z_'+this.domStr+'" patternUnits="objectBoundingBox"  width=".25" height=".125" patternContentUnits="objectBoundingBox">\
                        <rect height=".0625" width="10" y=".0312" style="fill:'+ this.signalColor.red +';stroke:#none;fill-opacity:0.8" /> </pattern>\
                        <pattern id="sidewalk_g_'+this.domStr+'" patternUnits="objectBoundingBox"  width=".25" height=".125" patternContentUnits="objectBoundingBox">\
						<rect height=".0625" width="10" y=".0312" style="fill:'+ this.signalColor.gray +';stroke:#none;fill-opacity:0.8" /> </pattern>\
                  </defs>';
                bg += '<rect x="' + em.data.map.road.x +
                    '" y="' + em.data.map.road.y +
                    '" width="' + em.data.map.road.width +
                    '" height="' + em.data.map.road.height
                    + '" stroke-width=0 stroke="none" fill="' + this.svgBox.svgBg + '" />';
                var old_info_status = true;
                if (em.data.map.turn_desc.phase_status[i] == 'red') {
                    old_info_status = false;
                }
                var old_info_title;
                if (em.data.map.turn_desc.phase_remaining[i] <= 0) {
                    old_info_title = '';
                } else {
                    old_info_title = em.data.map.turn_desc.phase_remaining[i] + " 秒";
                }

                if (em.data.map.turn_desc.phase_status[i] != "red") {
                    this.cd_data.phase_name = em.data.map.turn_desc.phase_name[i];
                    this.cd_data.time = em.data.map.turn_desc.phase_current[i];
                    this.cd_data.remain = em.data.map.turn_desc.phase_remaining[i];
                    this.cd_data.phase_status = em.data.map.turn_desc.phase_status[i];
                }
                //判断是否有实时数据关联的属性
                var info_box_id = em.data.inter_id + "_" + em.data.phase_plan_id + "_" + em.data.map.turn_desc.phase_name[i] + "_box";
                bg += '<rect x="' + em.data.map.old_info.x +
                    '" y="' + em.data.map.old_info.y +
                    '" width="' + em.data.map.old_info.width +
                    '" height="' + em.data.map.old_info.height +
                    '" display="none" stroke-width=1 stroke="#F5F5F5" fill="' + (this.signalColor[em.data.map.turn_desc.phase_status[i]] +
                        '" id="' + info_box_id + '" />');

                //信号旧信息
                var info_text_id = em.data.inter_id + "_" + em.data.phase_plan_id + "_" + em.data.map.turn_desc.phase_name[i] + "_t";
                var posx = em.data.map.old_info.x + em.data.map.old_info.width / 2;
                var posy = em.data.map.old_info.y + 24;
                bg += '<rect x="' + (em.data.map.old_info.x + 2) + '" y="' + (em.data.map.old_info.y + 2) + '" height="' + '140" width="'
                    + (em.data.map.old_info.width - 4) + '" rx="10" ry="5" style="display:none; stroke:#006600; fill: #000000"/>';
                bg += '<text x="' + posx + '" y="' + posy + '" style="display:none; fill: #FFFFFF; stroke: #FFFFFF; writing-mode: tb;" id="' + info_text_id + '">' + old_info_title + '</text> ';

                var p_d, p_s;
                var w_sidewalk = 21;
                if (em.data.map.road.path !== undefined && em.data.map.road.path.trim().length > 0) {
                    //路口

					console.log(em.data.map.road.path,'查看人行道路');
                    bg += '<path id="crossing_'+this.domStr+'" d="' + em.data.map.road.path + '" stroke="white" stroke-width="1" fill="#778899"/>';
                    var path_id = em.data.inter_id + "_" + em.data.phase_plan_id + "_" + em.data.map.turn_desc.phase_name[i] + "_p";
                    var sidewalk_id = em.data.inter_id + "_" + em.data.phase_plan_id + "_" + em.data.map.turn_desc.phase_name[i] + "_sw";
                    if (em.data.map.turn_desc.path !== undefined) {
                        //路线
                        if (em.data.map.turn_desc.path[i] !== undefined) {
                            for (var j = 0; j < em.data.map.turn_desc.path[i].length; j++) {
                                p_d = em.data.map.turn_desc.path[i][j];
                                p_s = em.data.map.turn_desc.phase_status[i];

                                console.log(p_d);
                                console.log(this.signalColor[em.data.map.turn_desc.phase_status[i]], this.signalColor[em.data.map.turn_desc.phase_status[i]] === "red", '=================*****************')
                                if (p_d.x !== undefined) {
                                    switch(p_d.d) {
                                        case 'h':
                                        case 'v':
                                            bg += '<rect class="' + sidewalk_id + '" id="' + sidewalk_id + j + '" x="' + p_d.x + '" y="' + p_d.y + '" width="' + p_d.w + '" height="' + p_d.h + '" stroke="#none" style="fill:url(#sidewalk_' + p_d.d + '_)" display=""  /> ';
                                            break;
                                        default:
                                            var v = parseFloat(p_d.d);
                                            if(!isNaN(v)) {
                                                            bg += '<rect class="' + sidewalk_id + '" id="' + sidewalk_id + j + '" x="0" y="0" width="' + p_d.h + '" height="' + p_d.w + 
                                                                '" stroke="#none" style="fill:url(#' + (this.signalColor[em.data.map.turn_desc.phase_status[i]] === "red"?"sidewalk_z_"+this.domStr:"sidewalk_h_"+this.domStr) +')" display=""' + 
                                                                'transform="translate(' + p_d.x + ',' + p_d.y + ') rotate(' + v + ')"  /> ';

                                                break;
                                            }
                                    }
                                } else {
                                    bg += '<path class="' + path_id + '" id="' + path_id + j + '" d="' + em.data.map.turn_desc.path[i][j] + '" stroke="' + this.signalColor[em.data.map.turn_desc.phase_status[i]] + '" stroke-width="5" fill="none" marker-end="url(' + "#markerArrow_" + em.data.map.turn_desc.phase_status[i] + ')";/>';
                                }
                            }
                        }
                    }
                } else {
                    bg += '<text x="' + em.data.map.road.x + '" y="' + em.data.map.road.y + '">"' + "抱歉,没有查询到数据！" + '</text>';
                }
                //方案名称
                bg += '<text x="' + (em.data.map.road.x + 10) + '" y="' + (em.data.map.road.y + 30) + '" style="font-size:' + this.svgFont.fontSize + ';font-weight:' + this.svgFont.fontWeight + ';fill: ' + this.svgFont.fontFill + '; stroke: ' + this.svgFont.fontStroke + '; ">' + em.data.map.turn_desc.phase_name[i] + '</text> ';

                bg += '</g></svg>';
                if (i % 2 == 0) {
                    tbl += '<tr style="border-collapse: collapse; border: none;"><td style="border-collapse: collapse; border: none;">' + bg + '</td>';
                } else {
                    tbl += '<td style="border-collapse: collapse; border: none;">' + bg + '</td></tr>';
                }
            }
            tbl += "</table><div class='secondBox' style='position:absolute;bottom:30px;right:15px;font-size:25px;color:#fff;font-weight:bold;'></div>";
            this.dom.append(tbl);
        },
        _bind: function () {
            var _this = this;
            var worker = new Worker('../js/countdown.js');

            console.log("开始");
            var cd_data = window.cd_data
            console.log(cd_data)
            worker.postMessage(cd_data);
            worker.onmessage = function (e) {
                console.log("看看下面是个啥？");
                console.log(e);
                var data = e.data;
                if (data.cmd === null) {
                    console.log("倒计时");
                    var phase_id = '#' + data.inter_id + "_" + data.phase_plan_id + "_" + data.phase_name + "_t";

                    console.log("下面的ID是啥：");
                    console.log(phase_id);
                    if (data.remain > 0) {
                        $(phase_id).text('剩 ' + data.remain + ' 秒');
                    } else {
                        console.log("倒计时结束");
                        cd_data.remain = data.remain;
                        worker.postMessage(cd_data);
                    }
                } else if (data.cmd === "noresponse") {
                    console.log("信号灯数据长时间没有更新");
                    return;
                } else {
                    // 再次请求同一个接口载入实时数据
                    $.get(_this.url, {}, function (em) {
                        // em = {"success":true,"data":{"total":1,"signal":{"inter_id":"11LAV063MH0","phase_plan_id":"1","phase_name":"A","current":1554113140,"status":"red","rec_time":1554113226,"remain":0}}};
                        console.log("这是接口返回的一个数据：");
                        console.log(em);
                        if (!em.success) {
                            console.log("数据有问题");
                        }
                        // 实时数据变化线的颜色
                        var signal_data = em.data;//数据赋值给signal_data
                        console.log("signal_data.total");
                        console.log(signal_data.total);
                        if (signal_data.total != 0) {//数据不为空时 signal_data中的 total:Number signal:{}
                            var signal = signal_data.signal;
                            var box_id, phase_id, path_id;
                            var map_data = window.map_data
                            for (var i = 0; i < map_data.data.total; i++) {
                                box_id = '#' + map_data.data.inter_id + "_" + map_data.data.phase_plan_id + "_" + map_data.data.map.turn_desc.phase_name[i] + "_box";
                                phase_id = '#' + map_data.data.inter_id + "_" + map_data.data.phase_plan_id + "_" + map_data.data.map.turn_desc.phase_name[i] + "_t";
                                path_id = '.' + map_data.data.inter_id + "_" + map_data.data.phase_plan_id + "_" + map_data.data.map.turn_desc.phase_name[i] + "_p";
                                // 更新数据
                                if (signal.phase_name == map_data.data.map.turn_desc.phase_name[i]) {
                                    map_data.data.map.turn_desc.phase_status[i] = signal.status;
                                    map_data.data.map.turn_desc.phase_current[i] = signal.current;
                                    map_data.data.map.turn_desc.phase_remaining[i] = signal.remain;

                                    cd_data.phase_name = signal.phase_name;
                                    cd_data.time = signal.current;
                                    cd_data.remain = signal.remain;
                                    cd_data.phase_status = signal.status;
                                    if (map_data.data.map.turn_desc.phase_remaining[i] <= 0) {
                                        $(phase_id).text('');
                                    } else {
                                        $(phase_id).text('剩 ' + map_data.data.map.turn_desc.phase_remaining[i] + ' 秒');
                                    }
                                } else {
                                    map_data.data.map.turn_desc.phase_status[i] = "red";
                                    map_data.data.map.turn_desc.phase_current[i] = signal.scurrent;
                                    map_data.data.map.turn_desc.phase_remaining[i] = signal.remain;
                                    $(phase_id).text('');
                                }
                                $(box_id).attr({ "fill": _this.signalColor[map_data.data.map.turn_desc.phase_status[i]] });


                                $(path_id).attr({
                                    'stroke': _this.signalColor[map_data.data.map.turn_desc.phase_status[i]],
                                    'marker-end': 'url(' + "#markerArrow_" + map_data.data.map.turn_desc.phase_status[i] + ')'
                                });

                            }
                        }
                        console.log("刷新数据每990毫秒请求一次");
                        console.log(cd_data)
                        var timeOut = setTimeout(function (e) { console.log("我是新的");worker.postMessage(cd_data); }, 4990);
                    });
                }
            }

        }
    }


    // JQuery对象方式
    $.fn.jqueryPhaseSvg = function (options) {
        $.extend(this, __DEF__, options, __PROP__);
        this._init();
        /*setTimeout(() =>{
            this._bind(); //有刷新的时候调用
        },5000);*/
    }
})(jQuery)
/*eslint-enable */
export default jQuery
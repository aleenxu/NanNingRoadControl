const echartss = {
  echarts1: {
    option: {
      color: ['#FBD106', '#2FF4F1'],
      title: {
        show: false,
        text: '折线图堆叠',
        padding: [5, 0, 0, 20],
        textStyle: {
          fontWeight: 'normal',
          color: '#FFFFFF',
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '5%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false, // 设为false首个在y轴
        data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
        axisLine: {
          lineStyle: {
            color: '#1C385F', // 轴的颜色
          },
        },
        splitLine: { // ---grid 区域中的分隔线
          show: true, // ---是否显示，'category'类目轴不显示，此时我的X轴为类目轴，splitLine属性是无意义的
          lineStyle: {
            color: ['#143058'],
            width: 1,
            type: 'solid',
          },
        },
        axisLabel: {
          rotate: 45, // 旋转角度
          textStyle: {
            color: '#FFFFFF', // 更改坐标轴文字颜色
            fontSize: 12, // 更改坐标轴文字大小
          },
          interval: 0, // 设置X轴数据间隔几个显示一个，为0表示都显示
        },
      },
      yAxis: {
        type: 'value',
        splitLine: { // ---grid 区域中的分隔线
          show: true, // ---是否显示，'category'类目轴不显示，此时我的X轴为类目轴，splitLine属性是无意义的
          lineStyle: {
            color: ['#143058'],
            width: 1,
            type: 'solid',
          },
        },

        axisLabel: {
          show: true,
          textStyle: {
            color: '#FFFFFF', // 更改坐标轴文字颜色
            fontSize: 14, // 更改坐标轴文字大小
          },
        },
        axisLine: {
          // show: true,
          lineStyle: {
            color: '#1C385F', // 轴的颜色
          },
        },

      },
      series: [
        {
          name: '联盟广告',
          type: 'line',
          stack: '总量',
          symbol: 'none', // 设置折线弧度，取值：0-1之间
          smooth: 0.5,
          data: [220, 182, 191, 234, 290, 330, 310],
        },
      ],
    },
  },
}

export default echartss

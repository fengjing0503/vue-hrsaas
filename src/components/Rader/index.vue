<template>
  <div id="container" />
</template>

<script>
import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2'
export default {
  name: 'Rader',
  mounted() {
    const data = [
      { item: '工作效率', a: 70, b: 30 },
      { item: '考勤', a: 60, b: 70 },
      { item: '积极性', a: 50, b: 60 },
      { item: '帮助同事', a: 40, b: 50 },
      { item: '自主学习', a: 60, b: 70 },
      { item: '正确率', a: 70, b: 50 }
    ]
    const { DataView } = DataSet
    const dv = new DataView().source(data)
    dv.transform({
      type: 'fold',
      fields: ['a', 'b'], // 展开字段集
      key: 'user', // key字段
      value: 'score' // value字段
    })

    const chart = new Chart({
      container: 'container',
      autoFit: true,
      height: 500
    })
    chart.data(dv.rows)
    chart.scale('score', {
      min: 0,
      max: 80
    })
    chart.coordinate('polar', {
      radius: 0.8
    })
    chart.tooltip({
      shared: true,
      showCrosshairs: true,
      crosshairs: {
        line: {
          style: {
            lineDash: [4, 4],
            stroke: '#333'
          }
        }
      }
    })
    chart.axis('item', {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            lineDash: null
          }
        }
      }
    })
    chart.axis('score', {
      line: null,
      tickLine: null,
      grid: {
        line: {
          type: 'line',
          style: {
            lineDash: null
          }
        }
      }
    })

    chart
      .line()
      .position('item*score')
      .color('user')
      .size(2)
    chart
      .point()
      .position('item*score')
      .color('user')
      .shape('circle')
      .size(4)
      .style({
        stroke: '#fff',
        lineWidth: 1,
        fillOpacity: 1
      })
    chart
      .area()
      .position('item*score')
      .color('user')
    chart.render()
  }
}
</script>

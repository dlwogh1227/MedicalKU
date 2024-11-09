am5.ready(function() {

    // Create root element
    var root = am5.Root.new("chartdiv");
    
    let screenWidth = window.innerWidth;
    // Set themes
    root.setThemes([
        am5themes_Animated.new(root)
    ]);
    
    // Create chart
    var chart = root.container.children.push(
        am5radar.RadarChart.new(root, {
            panX: false,
            panY: false,
            startAngle: 180,
            endAngle: 360
        })
    );
    
    // Create axis and its renderer
    var axisRenderer = am5radar.AxisRendererCircular.new(root, {
        innerRadius: -10,
        strokeOpacity: 1,
        strokeWidth: 20,
        strokeGradient: am5.LinearGradient.new(root, {
            rotation: 0,
            stops: [
                { color: am5.color("#65d692") }, // 연한 녹색 (파스텔)
                { color: am5.color("#e2cf6d") }, // 연한 노란색 (파스텔)
                { color: am5.color("#e4b578") }, // 연한 주황색 (파스텔)
                { color: am5.color("#db5656") }  // 연한 빨간색 (파스텔)
            ]
        })
    });
    
    var xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
            maxDeviation: 0,
            min: 0,
            max: 100,
            strictMinMax: true,
            renderer: axisRenderer
        })
    );
    
    xAxis.get("renderer").set("minGridDistance", 250);
    xAxis.get("renderer").labels.template.setAll({
        fontSize: 1
    });
    /* 레이블 UI */
    // Add custom labels to axis ranges
    function addAxisLabel(value, labelText) {
        var axisRange = xAxis.createAxisRange(xAxis.makeDataItem({ value: value }));
        axisRange.get("label").setAll({
            text: labelText,
            inside: true,
            radius: getResponsiveRadiusSize(), // 레이블 위치를 위쪽으로 조정
            fontSize: getResponsiveFontSize(),
            fill: am5.color(0x000000),
            centerX: am5.p50,
            centerY: am5.p50,
            fontWeight: "bold"
        });
    }
    // 각 구간에 맞는 문구 추가
    addAxisLabel(15, "낮음");
    addAxisLabel(50, "중간");
    addAxisLabel(85, "높음");
    /* 반응형 레이블 위치, 폰트사이즈*/
    function getResponsiveFontSize() {
        if (screenWidth < 768) return 10;  // 모바일 글꼴
        return 15;                         // 기본 글꼴
    }
    function getResponsiveRadiusSize() {
        if (screenWidth < 768) return -20;  // 모바일 글꼴
        return -30;                         // 기본 글꼴
    }
    
    var axisDataItem = xAxis.makeDataItem({});
    axisDataItem.set("value", 0);

    /* 화살표 UI */
    var bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
        location: 1,
        sprite: am5radar.ClockHand.new(root, 
            {radius: am5.percent(80),
            bottomWidth: getResponsiveBottomWidthSize(),           
            topWidth: 1,
            pinRadius: getResponsivePinRadiusSize()})
    }));
    
    function getResponsiveBottomWidthSize() {
        if (screenWidth < 768) return 4.8;
        return 7;
    }
    
    function getResponsivePinRadiusSize() {
        if (screenWidth < 768) return 2.7;
        return 4;
    }
    
    bullet.get("sprite").set("zIndex", 1);
    xAxis.createAxisRange(axisDataItem);
    axisDataItem.get("grid").set("visible", false);

    function returnRiskVal() {
        let riskVal = $(".riskVal").val(); //문자열
        console.log(riskVal);
        
        if(riskVal == 0) {
            return 0;
        }
        if(riskVal == 1) {
            return 15;
        }
        if(riskVal == 2) {
            return 50;
        }
        if(riskVal == 3) {
            return 85;
        }

        alert("risk 값이 올바르지 않습니다");
    }
    
    // Update gauge value and label
    function updateGauge(value) {
        axisDataItem.set("value", value); // Update gauge value
        bullet.get("sprite").set("zIndex", 10);
    }

    updateGauge(returnRiskVal());
    
    chart.appear(1000, 100);
    
    }); // end am5.ready()
    
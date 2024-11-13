am5.ready(function() {
    let screenWidth = window.innerWidth;
    // Create root element
    var root = am5.Root.new("chartdiv");
    
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
                { color: am5.color("#D1D80F")},    // 연한 녹색 (파스텔) - 시작
                { color: am5.color("#FEE114")}, // 연한 노란색 (파스텔) - 녹색과 빨간색 사이의 부드러운 전환을 위한 중간 색상
                { color: am5.color("#FFA500")}, // 연한 오렌지색 (파스텔) - 노란색에서 빨간색으로의 부드러운 전환
                { color: am5.color("#FF5656")} 
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
        fontSize: 0.2
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
            fontWeight: 500
        });
    }
    // 각 구간에 맞는 문구 추가

    addAxisLabel(50, "Moderate");

    /* 반응형 레이블 위치, 폰트사이즈*/
    // 반응형 폰트 크기 계산 함수
function getResponsiveFontSize() {
    var screenWidth = window.innerWidth; // 창 너비를 실시간으로 가져옴
    if (screenWidth < 768) {
        return 11; // 모바일에 적합한 작은 폰트 크기
    } else {
        return 16; // 데스크탑에 적합한 기본 폰트 크기
    }
}

// 반응형 레이블 위치 계산 함수
function getResponsiveRadiusSize() {
    var screenWidth = window.innerWidth; // 창 너비를 실시간으로 가져옴
    if (screenWidth < 768) {
        return -20; // 모바일에 적합한 가까운 레이블 위치
    } else {
        return -30; // 데스크탑에 적합한 기본 레이블 위치
    }
}

// 창 크기 변경 시 레이블 스타일 업데이트를 위한 이벤트 리스너
window.addEventListener('resize', function() {
    xAxis.axisRanges.each(function(range) {
        range.get("label").setAll({
            radius: getResponsiveRadiusSize(), // 레이블 위치 업데이트
            fontSize: getResponsiveFontSize() // 폰트 크기 업데이트
        });
    });
});

    
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
        var screenWidth = window.innerWidth;  // 현재 창 너비 가져오기
        if (screenWidth < 768) {
            return 4.8;  // 모바일에서 좁은 하단 폭
        } else {
            return 7;    // 데스크탑에서 넓은 하단 폭
        }
    }
    
    // 핀 반지름을 반응형으로 계산하는 함수
    function getResponsivePinRadiusSize() {
        var screenWidth = window.innerWidth;  // 현재 창 너비 가져오기
        if (screenWidth < 768) {
            return 3.5;  // 모바일에서 작은 핀 반지름
        } else {
            return 5;    // 데스크탑에서 큰 핀 반지름
        }
    }
    
    // 창 크기 변경 시 화살표 스타일 업데이트를 위한 이벤트 리스너
    window.addEventListener('resize', function() {
        bullet.get("sprite").setAll({
            bottomWidth: getResponsiveBottomWidthSize(),
            pinRadius: getResponsivePinRadiusSize()
        });
    });
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

    xAxis.get("renderer").labels.template.set("disabled", true);
    
    }); // end am5.ready()
    
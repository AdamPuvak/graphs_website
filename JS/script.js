
var script = document.createElement('script');
script.src = 'https://cdn.plot.ly/plotly-latest.min.js';
document.head.appendChild(script);

function changeTab(tabNumber) {
    document.getElementById('tab1').style.display = 'none';
    document.getElementById('tab2').style.display = 'none';

    document.getElementById('tab' + tabNumber).style.display = 'block';
}
function toggleMenu() {
    var navLinks = document.querySelector('.nav-links');
    navLinks.style.display = (navLinks.style.display === 'none' || navLinks.style.display === '') ? 'flex' : 'none';
}

function loadAndProcessXML() {
    var xmlFile = "XML/z03.xml";

    fetch(xmlFile)
        .then(response => response.text())
        .then(data => {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(data, 'application/xml');
            createVerticalChart(xmlDoc);
            createPieCharts(xmlDoc);
            createLineChart(xmlDoc);
        })
        .catch(error => {
            console.error('Error loading XML file:', error);
        });
}
function createVerticalChart(xmlDoc) {
    var data = Array.from(xmlDoc.querySelectorAll('zaznam')).map(entry => {
        return {
            year: entry.querySelector('rok').textContent,
            ratings: Array.from(entry.querySelectorAll('hodnotenie > *')).map(ele => parseInt(ele.textContent))
        };
    });

    var traces = Array.from({ length: 7 }, (_, index) => {
        return {
            x: data.map(entry => entry.year),
            y: data.map(entry => entry.ratings[index]),
            type: 'bar',
            name: ['A', 'B', 'C', 'D', 'E', 'FX', 'FN'][index]
        };
    });
    var layout;
    if (window.innerWidth < 768){
        layout = {
            title: 'WEBTECH - výsledky',
            xaxis: {
                title: 'Hodnotenie',
                range: [0, 60],
                showgrid: true,
                showline: true,
                ticks: 'outside'
            },
            yaxis: {
                title: 'Rok',
                showgrid: true,
                showline: true,
                ticks: 'outside'
            },
            width: 0.90*(window.innerWidth),
            height: 700

        };
        traces.forEach(trace => {
            trace.x = data.map(entry => entry.ratings[traces.indexOf(trace)]);
            trace.y = data.map(entry => entry.year);
            trace.orientation = 'h';
        });
    }
    else{
        layout = {
            title: 'WEBTECH - výsledky',
            xaxis: {
                title: 'Rok',
                showgrid: true,
                showline: true,
                ticks: 'outside'
            },
            yaxis: {
                title: 'Hodnotenie',
                range: [0, 60],
                showgrid: true,
                showline: true,
                ticks: 'outside'
            },
            width: 750,
            height: 500
        };
    }

    function updateChart() {
        if (window.innerWidth < 768) {
            layout = {
                title: 'WEBTECH - výsledky',
                xaxis: {
                    title: 'Hodnotenie',
                    range: [0, 60],
                    showgrid: true,
                    showline: true,
                    ticks: 'outside'
                },
                yaxis: {
                    title: 'Rok',
                    showgrid: true,
                    showline: true,
                    ticks: 'outside'
                },
                width: 0.90*(window.innerWidth),
                height: 700
            };
            traces.forEach(trace => {
                trace.x = data.map(entry => entry.ratings[traces.indexOf(trace)]);
                trace.y = data.map(entry => entry.year);
                trace.orientation = 'h';
            });
        } else {
            layout = {
                title: 'WEBTECH - výsledky',
                xaxis: {
                    title: 'Rok',
                    showgrid: true,
                    showline: true,
                    ticks: 'outside'
                },
                yaxis: {
                    title: 'Hodnotenie',
                    range: [0, 60],
                    showgrid: true,
                    showline: true,
                    ticks: 'outside'
                },
                width: 750,
                height: 500
            };
            traces.forEach(trace => {
                trace.x = data.map(entry => entry.year);
                trace.y = data.map(entry => entry.ratings[traces.indexOf(trace)]);
                trace.orientation = 'v';
            });
        }
        Plotly.update('chart_vert', traces, layout);
    }

    window.addEventListener('resize', function () {
        updateChart();
    });

    Plotly.newPlot('chart_vert', traces, layout);
}
function createPieCharts(xmlDoc) {
    var data = Array.from(xmlDoc.querySelectorAll('zaznam')).map(entry => {
        return {
            year: entry.querySelector('rok').textContent,
            ratings: Array.from(entry.querySelectorAll('hodnotenie > *')).map(ele => parseInt(ele.textContent))
        };
    });

    data.forEach((entry, index) => {
        var trace = {
            labels: ['A', 'B', 'C', 'D', 'E', 'FX', 'FN'],
            values: entry.ratings,
            type: 'pie',
            name: 'Graf ' + (index + 1)
        };

        var layout = {
            title: 'WEBTECH - Výsledky (' + entry.year+ ')',
            width: 350,
            height: 400
        };

        var divId = 'chart_pie_' + (index + 1);
        Plotly.newPlot(divId, [trace], layout);
    });
}
function createLineChart(xmlDoc) {
    var data = Array.from(xmlDoc.querySelectorAll('zaznam')).map(entry => {
        return {
            year: entry.querySelector('rok').textContent,
            countFX: parseInt(entry.querySelector('hodnotenie > FX').textContent),
            countFN: parseInt(entry.querySelector('hodnotenie > FN').textContent)
        };
    });

    function createChart() {
        var trace = {
            x: data.map(entry => entry.year),
            y: data.map(entry => entry.countFX + entry.countFN),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Súčet FX a FN',
            line: {
                shape: 'linear'
            }
        };

        var newWidth = window.innerWidth;
        var newHeight = window.innerWidth;
        if (window.innerWidth < 768) {
            newWidth *= 0.90;
            newHeight *= 0.60;
        }
        else{
            newWidth = 700;
            newHeight = 500;
        }

        var layout = {
            title: 'Súčet FX a FN za jednotlivé roky',
            xaxis: {
                title: 'Rok'
            },
            yaxis: {
                title: 'Počet',
                showgrid: true,
                showline: true,
                ticks: 'outside',
                range: [0, 10]
            },
            width: newWidth,
            height: newHeight
        };

        Plotly.newPlot('chart_line', [trace], layout);
    }

    window.addEventListener('resize', function () {
        createChart();
    });

    createChart();
}


const arrGraphX_def = [];
var arrGraphY1_def = [];
var arrGraphY2_def = [];
let source;
var amplitude = 1;
var visibilityY1 = true;
var visibilityY2 = true;
function updateAmplitudeSlider() {
    amplitude = parseFloat(document.getElementById('amplitude-slider').value);
    document.getElementById('amplitude-value').innerText = amplitude;
    document.getElementById('amplitude-text').value = amplitude;

    var slider = document.getElementById('amplitude-slider');
    var label = document.getElementById('amplitude-label');
    var labelWidth = label.offsetWidth;

    var sliderWidth = slider.offsetWidth;
    var sliderMax = parseFloat(slider.max);
    var sliderPosition = (sliderWidth * amplitude) / sliderMax;

    var correction = (labelWidth - sliderWidth) / 2;

    label.style.left = `calc(${sliderPosition}px - ${labelWidth / 2}px + 49.5% + ${correction}px)`;

    createSinConChart(arrGraphX_def, arrGraphY1_def, arrGraphY2_def);
}
function updateAmplitudeText() {
    amplitude = parseFloat(document.getElementById('amplitude-text').value);

    amplitude = Math.max(1, Math.min(amplitude, 10));

    document.getElementById('amplitude-text').value = amplitude;
    document.getElementById('amplitude-slider').value = amplitude;

    updateAmplitudeSlider();
}
function updateGraphVisibility() {
    var checkboxY1 = document.getElementById('checkboxY1');
    var checkboxY2 = document.getElementById('checkboxY2');

    visibilityY1 = checkboxY1.checked;
    visibilityY2 = checkboxY2.checked;

    createSinConChart();
}
function startFetch() {
    source = new EventSource("https://old.iolab.sk/evaluation/sse/sse.php");
    source.addEventListener("message", listenerFunctionContent);
}
function stopFetch() {
    if (source) {
        source.close();
    }
}
function listenerFunctionContent(e) {
    var data = JSON.parse(e.data);

    if (+data.x === 0) {
        arrGraphY1_def = [data.y1];
        arrGraphY2_def = [data.y2];
    } else {
        arrGraphX_def.push(data.x);
        arrGraphY1_def.push(data.y1);
        arrGraphY2_def.push(data.y2);
    }
    createSinConChart(arrGraphX_def, arrGraphY1_def, arrGraphY2_def);
}
function createSinConChart() {
    var y1Data = arrGraphY1_def.map(value => visibilityY1 ? value * amplitude : null);
    var y2Data = arrGraphY2_def.map(value => visibilityY2 ? value * amplitude : null);

    var trace1 = {
        x: arrGraphX_def,
        y: y1Data,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Y1',
        line: {
            shape: 'linear'
        }
    };

    var trace2 = {
        x: arrGraphX_def,
        y: y2Data,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Y2',
        line: {
            shape: 'linear'
        }
    };
    var layout = {
        title: 'Graf sínusu a kosínu',
        xaxis: {
            title: 'X'
        },
        yaxis: {
            title: 'Y',
            showgrid: true,
            showline: true,
            ticks: 'outside'
        },
        width: calculateChartWidth(),
        height: calculateChartHeight()
    };

    Plotly.newPlot("chart_sin_con", [trace1, trace2], layout);
}
function calculateChartWidth() {
    if (window.innerWidth < 768) {
        return 0.9 * window.innerWidth;
    } else {
        return 700;
    }
}
function calculateChartHeight() {
    if (window.innerWidth < 768) {
        return 0.7 * window.innerWidth;
    } else {
        return 500;
    }
}

window.addEventListener('resize', function () {
    createSinConChart(arrGraphX_def, arrGraphY1_def, arrGraphY2_def)
});

document.addEventListener("DOMContentLoaded", function () {
    var navLinks = document.querySelector('.nav-links');
    navLinks.style.display = 'none';

    loadAndProcessXML();
    startFetch();
});

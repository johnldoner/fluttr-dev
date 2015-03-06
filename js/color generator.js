var rgb = [];

for(var i = 0; i < 3; i++)
    rgb.push(Math.floor(Math.random() * 255));

document.getElementById('panel panel-warning','.panel-footer').style.backgroundColor = 'rgb('+ rgb.join(',') + ')';

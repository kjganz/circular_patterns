window.onload = function() {
    var c,
        ctx,
        canvasSize,
        outer_radius,
        inner_radius,
        inner_offset,
        size_offset,
        dist_from_center,
        rot_speed,
        num_cycles,
        sample_size;
    // var vertices = [];
    // var numVertices = 5;
    // var verticesChanged = true;
    var maxDepth = 3;
    var lineWidth = 1;
    var redraw = false;
    // var drawAsLines = false;
    // var fillWithColor = false;
    var line_colors = [];
    // var skipDepth = 0;
    // var skipDepthCount = 1;
    // var skipSide = 0;
    // var connectDots = true;

    var temp;

    var init = function() {
        c = document.getElementById("canvas");
        ctx = c.getContext('2d');
        setCanvasSize();

        // make the outer circle 90% of the canvas size
        outer_radius = 0.45 * canvasSize;

        colors = [
            {r: 207, g: 50, b: 255},
            {r: 118, g: 255, b: 94}
        ];

        draw();
    };

    var setCanvasSize = function() {
        canvasSize = 500;
        c.width = canvasSize;
        c.height = canvasSize;
    };

    var draw = function() {
        fetchParams();
        // Draw the circumscribed circle
        ctx.fillStyle="black";
        ctx.fillRect(0,0, c.width, c.height);
        // ctx.clearRect(0, 0, c.width, c.height);
        // ctx.beginPath();
        // ctx.arc(canvasSize/2, canvasSize/2, 0.9 * canvasSize/2, 0, 2*Math.PI);
        // ctx.lineWidth = lineWidth;
        // ctx.stroke();

        // update variables from params
        inner_radius = (size_offset / 100.0) * outer_radius;
        dist_from_center = (inner_offset / 100.0) * outer_radius;

        // Calculate how many cycles the inner circle needs
        // to rotate around to make a complete pattern
        str_of_speed = rot_speed.toFixed(4);
        decimal = Number(str_of_speed.split('.')[1]);
        // Magic numbers yay!
        num_cycles = 10000 / gcd(decimal, 10000);

        // spin circle inside of the other one
        var x, y, circle_x, circle_y;
        var total = num_cycles * (2*Math.PI);
        var sample_step = 2*Math.PI / sample_size;
        for (var i = 0; i < total; i += sample_step) {
            circle_x = dist_from_center * Math.cos(i) + canvasSize/2;
            circle_y = dist_from_center * Math.sin(i) + canvasSize/2;

            x = inner_radius*Math.cos(i * rot_speed) + circle_x;
            y = inner_radius*Math.sin(i * rot_speed) + circle_y;

            var color = get_color_from_gradient(colors,
                                                i / total,
                                                true);
            // console.log(color);

            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
        }
    };

    var drawPattern = function(v, depth, maxDepth) {

        // if (depth <= maxDepth) {
        //     var newV = [];
        //     var drawLevel = shouldDrawLevel(depth);
        //     for (var i = 0; i < v.length; i++) {
        //         newV.push( {x: (v[i].x * (1 - offset)) + (v[index(i+1)].x * offset),
        //                     y: (v[i].y * (1 - offset)) + (v[index(i+1)].y * offset)});

        //         var drawSide = (i + 1) % skipSide !== 0 ? true : false;

        //         if (drawLevel && drawSide) {
        //             if (drawAsLines) {
        //                 ctx.beginPath();
        //                 ctx.moveTo(v[i].x, v[i].y);
        //                 ctx.lineTo(v[index(i+1)].x, v[index(i+1)].y);
        //                 ctx.lineWidth = lineWidth;
        //                 ctx.stroke();
        //             } else {
        //                 ctx.beginPath();
        //                 ctx.moveTo(newV[i].x, newV[i].y);
        //                 ctx.lineTo(v[index(i+1)].x, v[index(i+1)].y);
        //                 ctx.lineTo((v[index(i+1)].x * (1-offset)) + (v[index(i+2)].x * offset),
        //                            (v[index(i+1)].y * (1-offset)) + (v[index(i+2)].y * offset));
        //                 ctx.closePath();

        //                 if (fillWithColor) {
        //                     ctx.lineWidth = 0;
        //                     ctx.fillStyle = color[0];
        //                     ctx.fill();
        //                 } else {
        //                   ctx.lineWidth = lineWidth;
        //                   ctx.stroke();
        //                 }
        //             }
        //         }
        //     }

        //     drawPattern(newV, depth + 1, maxDepth);
        // }
    };

    var fetchParams = function() {
        redraw = false;
        var params = [];
        // Should be updated to only get the id of the inputs
        // not every element that has an id
        $('[id]').each(function() {
            params.push($(this).attr("id"));
        });
        for (var i = 0; i < params.length; i++) {
            updateParam( params[i], Number($('#' + params[i]).val()) );
        }
    };

    var updateParam = function(param, value) {
        switch (param) {
            case 'inner-offset':
                if (value < 1) { value = 1; }
                if (value > 100) { value = 100; }
                if (value != inner_offset) {
                    inner_offset = value ;
                }
                break;

            case 'size-offset':
                if (value < 1) { value = 1; }
                if (value > 100) { value = 100; }
                if (value != size_offset) {
                    size_offset = value;
                }
                break;

            case 'rot-speed':
                if (value != rot_speed) {
                    rot_speed = value;
                }
                break;

            case 'num-cycles':
                if (value < 1) { value = 1; }
                if (value != num_cycles) {
                    num_cycles = value;
                }
                break;

            case 'sample-size':
                if (value < 100) { value = 100; }
                if (value != sample_size) {
                    sample_size = value;
                }
                break;

            default:
                return;
        }

        $('#' + param).val(value);
        if (redraw === true) {
            draw();
        }
    };

    var cycleParam = function(param) {
        // switch (param) {
        //     case 'line-or-triangle':
        //         drawAsLines = drawAsLines ? false : true;
        //         value = drawAsLines ? 'Lines' : 'Triangles';
        //         break;

        //     case 'fill':
        //         fillWithColor = fillWithColor ? false : true;
        //         value = fillWithColor? 'Fill' : 'No Fill';
        //         break;

        //     case 'pattern':
        //         connectDots = connectDots ? false : true;
        //         value = connectDots ? 'Lines' : 'Polygons';
        //         break;

        //     default:
        //         return;
        // }

        $('#' + param).html(value);
        draw();
    };

    $('.decrement').click(function() {
        param = $(this).attr('param');
        value = Number($('#' + param).val()) - Number($('#' + param).attr('step'));
        redraw = true;
        updateParam(param, value);
    });

    $('.increment').click(function() {
        param = $(this).attr('param');
        value = Number($('#' + param).val()) + Number($('#' + param).attr('step'));
        redraw = true;
        updateParam(param, value);
    });

    $('.cycle').click(function() {
        cycleParam($(this).attr('id'));
    });

    $('#draw').click(function() {
        draw();
    });

    // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    var gcd = function(a, b) {
        return !b ? a : gcd(b, a % b);
    };

    // Based on the total number of steps and current step,
    // get the intermediate gradient color
    var get_color_from_gradient = function(colors, progress, hex) {
        var color_one_prog, color_two_prog;
        if (progress <= 0.5) {
            color_one_prog = 1 - 2 * progress;
            color_two_prog = 2 * progress;
        } else {
            color_one_prog = 2 * progress - 1;
            color_two_prog = 2 - 2 * progress;
        }

        r = Math.floor((colors[0].r * color_one_prog + colors[1].r * color_two_prog) / 2);
        g = Math.floor((colors[0].g * color_one_prog + colors[1].g * color_two_prog) / 2);
        b = Math.floor((colors[0].b * color_one_prog + colors[1].b * color_two_prog) / 2);

        return hex ? rgbToHex(r, g, b) : {r: r, g: g, b: b};
    };

    init();
};
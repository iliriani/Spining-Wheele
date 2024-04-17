// Created by Ilirian Ibrahimi

var padding = { top: 20, right: 40, bottom: 40, left: 20 },
    screenWidth = window.innerWidth * 0.9, // 90% of screen width
    screenHeight = window.innerHeight * 0.9, // 90% of screen height
    w = Math.min(screenWidth, screenHeight) - padding.left - padding.right,
    h = Math.min(screenWidth, screenHeight) - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    color = d3.scale.category20();

    var data = [
        { "label": "1 x Hot Dog gratis!", "value": 1, "question": "Glückwunsch! Du hast einen gratis Hot Dog gewonnen!" }, 
        { "label": "Pech gehabt! 😞", "value": 2, "question": "Sorry, viel Glück beim nächsten Mal." }, 
        { "label": "Pech gehabt! 😞", "value": 3, "question": "Sorry, viel Glück beim nächsten Mal." }, 
        { "label": "100 Frischhaltebögen gratis", "value": 4, "question": "Glückwunsch! Du hast 100 gratis Frischhaltebögen gewonnen!" }, 
        { "label": "Pech gehabt! 😞", "value": 5, "question": "Sorry, viel Glück beim nächsten Mal." }, 
        { "label": "Ein kleines Trostpflaster!", "value": 6, "question": "Glückwunsch! Du hast ein kleines Trostpflaster gewonnen!" }, 
        { "label": "Pech gehabt! 😞", "value": 7, "question": "Sorry, viel Glück beim nächsten Mal." }, 
        { "label": "Pech gehabt! 😞", "value": 8, "question": "Sorry, viel Glück beim nächsten Mal." } 
    ];

    var svg = d3.select('#chart')
        .append("svg")
        .data([data])
        .attr("width", w + padding.left + padding.right)
        .attr("height", h + padding.top + padding.bottom);
    var container = svg.append("g")
        .attr("class", "chartholder")
        .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");
    var vis = container
        .append("g");

    var pie = d3.layout.pie().sort(null).value(function (d) { return 1; });
    var arc = d3.svg.arc().outerRadius(r);

    var arcs = vis.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", "slice");

    arcs.append("path")
        .attr("fill", function (d, i) { return color(i); })
        .attr("d", function (d) { return arc(d); });

    
    var fontSize = Math.min(screenWidth, screenHeight) * 0.02; 

    arcs.append("text")
    .style("font-size", fontSize + "px") // Set font size dynamically
    .attr("transform", function (d) {
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle) / 2;
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
    })
        .attr("text-anchor", "end")
        .text(function (d, i) {
            return data[i].label;
        });

    container.on("click", spin);

// Add event listener for keydown event on the document
document.addEventListener("keydown", function(event) {
    // Check if the pressed key is Enter
    if (event.keyCode === 13) {
        // Execute the spin function when Enter is pressed
        spin();
        //Close the popup
        document.getElementById("popup").style.display = "none";
    } else if (event.keyCode === 32) { // Check if the pressed key is Space
        // Execute the spin function when Space is pressed
        spin();
        // Close the popup if it's open
        if (document.getElementById("popup").style.display === "block") {
            document.getElementById("popup").style.display = "none";
        }
    }
});


function spin(d) {
    container.on("click", null);

    var ps = 360 / data.length,
        pieslice = Math.round(1440 / data.length),
        rng = Math.floor((Math.random() * 1440) + 360);

    rotation = (Math.round(rng / ps) * ps);

    picked = Math.round(data.length - (rotation % 360) / ps);
    picked = picked >= data.length ? (picked % data.length) : picked;

    rotation += 90 - Math.round(ps / 2);
    vis.transition()
        .duration(3000)
        .attrTween("transform", rotTween)
        .each("end", function () {
            document.getElementById("popup-question").textContent = data[picked].question;
            document.getElementById("popup").style.display = "block";
            oldrotation = rotation;
            container.on("click", spin);
            
            // Check if picked value corresponds to 1, 4, or 6
            if (data[picked].value === 1 || data[picked].value === 4 || data[picked].value === 6) {
                // Trigger confetti animation
						const count = 400,
						  defaults = {
							origin: { y: 0.7 },
						  };

						function fire(particleRatio, opts) {
						  confetti(
							Object.assign({}, defaults, opts, {
							  particleCount: Math.floor(count * particleRatio),
							})
						  );
						}

						fire(0.25, {
						  spread: window.innerWidth,
						  startVelocity: 55,
						});

						fire(0.2, {
						  spread: window.innerWidth,
						});

						fire(0.35, {
						  spread: window.innerWidth,
						  decay: 0.91,
						  scalar: 0.8,
						});

						fire(0.1, {
						  spread: window.innerWidth,
						  startVelocity: 25,
						  decay: 0.92,
						  scalar: 1.2,
						});

						fire(0.1, {
						  spread: window.innerWidth,
						  startVelocity: 45,
						});
            }
        });
}


    svg.append("g")
        .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h / 2) + padding.top) + ")")
        .append("path")
        .attr("d", "M-" + (r * .15) + ",0L0," + (r * .05) + "L0,-" + (r * .05) + "Z")
        .style({ "fill": "black" })
        .style("stroke", "rgb(198, 110, 29)")
        .style("stroke-width", "2px") ;

    container.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 60)
        .style({ "fill": "white", "cursor": "pointer", "stroke": "rgb(198, 110, 29)", "stroke-width": "2px" });
		
		// Append a clipPath element
var defs = svg.append("defs");

// Define a clipPath
var clip = defs.append("clipPath")
    .attr("id", "imageClip")
    .append("circle")
    .attr("cx", 0) // Center of the circle
    .attr("cy", 0) // Center of the circle
    .attr("r", 55); // Radius of the circle, adjust as needed

container.append("image")
    .attr("xlink:href","data:image/png;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/4QAuRXhpZgAATU0AKgAAAAgAAkAAAAMAAAABAGoAAEABAAEAAAABAAAAAAAAAAD/2wBDAAoHBwkHBgoJCAkLCwoMDxkQDw4ODx4WFxIZJCAmJSMgIyIoLTkwKCo2KyIjMkQyNjs9QEBAJjBGS0U+Sjk/QD3/2wBDAQsLCw8NDx0QEB09KSMpPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT3/wAARCAD0AdoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2WiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKSlqteX9vYx77iVUHuev09amUlFXbsNJt2RYpa5+38XWU1yYpA8SdFkYcH6+lbqOsihlIKnoQainXhV+B3LqUp03aasPooorUzCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKiuLmK1gaadwkajJY9qlprKHUhgCD1BpO9tBq3U5PUfGLNuj06PA6ebIP5D/AB/KuZnnluZDJPI0j+rGuu1bwnFODLYYhk6mP+Fv8P5VyU8EtrKYbiMxuOxH+eK+YzBYlS/evTpbY+gwLw7X7ta9b7kdaOl65daU4CHzIO8bHj8PSs6iuClVnSlzQdmdtSnGouWauj0nTdVt9Ug8yBuR95D1X61dry61uprOdZoJCjr3Hf6+orudE12LVY9jYjuFHzJnr7j2r6TBZhGv7k9JHgYvAyo+9HVGzRRRXpnAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVQ1PSrfVIPLnT5h91x95foav0c1E4RmnGSuioycWnF2Z5rqek3Glz7JhuQn5JAOD/AIH2qlXqF1aRXsDwzoHRhyDXAazo0ukz4OXgc/JJj9D7183jsA6Pvw1j+R72Dxyq+5PR/mZ1OjleCVZInKOhypBplFeYm07o9FpNWZ3+g66mqW+2TC3CD5l9fcf54rYry62uZLS4SeFiroeD/nsa9D0nU49Us1mj4bo6/wB096+my/G+3jyS+JHz2OwnsZc0dn+Bfooor1DzwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACq93aRXtu8M6hkYYIqxRSlFSTi9hptO6PNdV0uTSrxoZcsp5R8feH+IqlXo+saZHqlk0TYDjlGx909q86mhkt53ilXa6HDCvlswwfsJ3Xws+iwWK9tCz3Q2tDRdTbSr4SZJhfiQe3r+FZ9FcVKo6clKL1R11IKpFxktGeqI6yIHUgqRkEU+uX8Ian5sLWMrfNGN0ZPdfT8P611FfYYesq1NTR8tWpOlNwfQKKKK3MgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooo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g5voaUqbqTUV1OU1m+/tHU5pwcoDtT/dH+SfxqLTrKTUbyO2jz8xyzf3V7mquOgAyTwAOc13vhzR/wCzbPzJV/0mXl/9kelfNYWhLF1nKW17s+gxNaOFoqMd9ka1tAltAkUa7URQqj2qWiivqUklZHzjd3cKKKKYgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAI5ZUgiaSRgqICWJ7CvONW1FtUv3uDkJ92NT2X/E9fxrZ8Va15rmwgb5EP70juf7tQ+HvD7Xzrd3SkWyn5VP8Ay0/+t/OvCxtSWKqqhS2W7PYwkI4am69Td7FjwtoZdlv7peBzCpHX/a/w/OuvpAAoAAAA7ClFerhsPGhBRj8zza9aVablIWiiiugxCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooASue8R6+LGM2tqw+0MPmIP+rH+NP1jXHjf7Fpqma8bg7RkJ/n9O9R6P4ZW3b7VqDCa5J3YJyFPr7n3rhr1J1W6VH5vsddGnCmvaVfku/8AwDO0Hw01yRdX6ssWcrGer+5/zzXZKAgCgAADgCl7UVrh8NChHlj82ZV8ROtK8vuFooorpMQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAEYhRk8Ad6zLpbzUCYoC1tB/FKR87f7o7fU/lWpRUSjzKw4ytqUrDTLbToytvGBnqx5Zvqau4oopxioqyQNuTuwoooqhBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//2Q==") 
    .attr("x", -50) // Adjust positioning as needed
    .attr("y", -50) // Adjust positioning as needed
    .attr("width", 110) // Adjust width as needed
    .attr("height", 100) // Adjust height as needed
	.attr("clip-path", "url(#imageClip)"); // Make the image rounded



    function rotTween(to) {
        var i = d3.interpolate(oldrotation % 360, rotation);
        return function (t) {
            return "rotate(" + i(t) + ")";
        };
    }

    function getRandomNumbers() {
        var array = new Uint16Array(1000);
        var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
        if (window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function") {
            window.crypto.getRandomValues(array);
        } else {
            for (var i = 0; i < 1000; i++) {
                array[i] = Math.floor(Math.random() * 100000) + 1;
            }
        }
        return array;
    }

    // Close the popup when the close button is clicked
    document.getElementsByClassName("close")[0].addEventListener("click", function() {
        document.getElementById("popup").style.display = "none";
    });

    // Close the popup when the close button is clicked
    document.getElementById("close-button").addEventListener("click", function() {
        document.getElementById("popup").style.display = "none";
    });

    
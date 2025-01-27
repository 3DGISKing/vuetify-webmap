<template>
    <div class="toolbar">
        <a href="#" class="add-label" title="Add Label"></a>
        <a href="#" class="add-line" title="Add Line"></a>
        <a href="#" class="add-point" title="Add Point"></a>
        <a href="#" class="add-polygon" title="Add Polygon"></a>
        <a href="#" class="clean" title="Clean"></a>
    </div>
</template>

<style scoped>
.toolbar {
    width: 55px; /* Set a width if you like */
    background: gray;
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    padding: 5px;
}

.toolbar a {
    width: 40px;
    height: 40px;
    background-color: #eee; /* Grey background color */

    color: black; /* Black text color */
    display: block; /* Make the links appear below each other */
    padding: 12px; /* Add some padding */
    text-decoration: none; /* Remove underline from links */

    display: block;
    text-align: center;
    text-decoration: none;

    border: 2px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;

    margin-bottom: 5px;

    background-repeat: no-repeat !important;
    background-position: center center !important;
}

.toolbar a.add-label {
    background: url("data/images/add_label.svg");
}

.toolbar a.add-line {
    background: url("data/images/add_line.svg");
}

.toolbar a.add-point {
    background: url("data/images/add_point.svg");
}

.toolbar a.add-polygon {
    background: url("data/images/add_polygon.svg");
}

.toolbar a.clean {
    background: url("data/images/clean.svg");
}

.toolbar a:hover {
    background-color: #ccc; /* Dark grey background on mouse-over */
}
</style>

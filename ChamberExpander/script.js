//TODO: Calculate instead, currently for weak BMEP of around 0.6 MPa
const portToPipeRatio = 1.125;
const portToMidSectionRatio = 2.125;
const hornCoefficient = 2;

var power = 3;
var RPM = 500;
var displacement = 50;
var boreDiameter = 40;
var exhaustDegrees = 120;

function Compute() {
    RPM = document.getElementById("RPM").value;
    displacement = document.getElementById("Displacement").value;
    boreDiameter = document.getElementById("BoreDiameter").value;
    power = document.getElementById("Power").value
    exhaustDegrees = document.getElementById("ExhaustDegrees").value
    
    document.getElementById("BMEP").innerText = BMEPMegaPascal() + " MPa";
    document.getElementById("Temperature").innerText = (temperatureFromBMEPMegaPascal()-273.15) + " ° C";
    document.getElementById("ExhaustTime").innerText = exhaustTime()*1000 + " milliseconds";
    document.getElementById("TunedLength").innerText = tunedLength()*1000 + " millimeters";
    document.getElementById("ExhaustDiameter").innerText = AreaToDiameter() + " millimeters";

    document.getElementById("L1").innerText = tunedLength() * 0.1 + " millimeters (including port length)";
    document.getElementById("L2").innerText = tunedLength() * 0.275 + " millimeters";
    document.getElementById("L3").innerText = tunedLength() * 0.183 + " millimeters";
    document.getElementById("L4").innerText = tunedLength() * 0.092 + " millimeters";
    document.getElementById("L5").innerText = tunedLength() * 0.11 + " millimeters";
    document.getElementById("L6").innerText = tunedLength() * 0.24 + " millimeters";
    document.getElementById("L7").innerText = tunedLength() * 0.24 + " millimeters";

    document.getElementById("D1").innerText = tunedLength() * portToPipeRatio + " millimeters";
    document.getElementById("D4").innerText = tunedLength() * portToMidSectionRatio + " millimeters";
    document.getElementById("D5").innerText = tunedLength() * portToMidSectionRatio + " millimeters";
    document.getElementById("D2").innerText = ComputeSecondDiameter() + " millimeters";
    document.getElementById("D3").innerText = ComputeThirdDiameter() + " millimeters";
    document.getElementById("D6").innerText = tunedLength() * portToOutletRatio() + " millimeters";
    document.getElementById("D7").innerText = tunedLength() * portToOutletRatio() + " millimeters";
}

function BMEPMegaPascal() {
    return power*1000 /
    (displacement * (RPM/60));
}

function temperatureFromBMEPMegaPascal() {
    return 506.15 + BMEPMegaPascal()*1000/3;
}

function estimatedSonicVelocity() {
    return Math.sqrt(1.36 * 300 * temperatureFromBMEPMegaPascal());
}

function exhaustTime() {
    return exhaustDegrees / (6 * RPM);
}

function tunedLength() {
    return estimatedSonicVelocity() * exhaustTime() / 2;
}

function ArcToChordWidth() {
    document.getElementById("ChordWidth").value = 
    boreDiameter * Math.sin((document.getElementById("ArcWidth").value / (Math.PI * boreDiameter)) * Math.PI);
    Compute();
}

function AreaToDiameter() {
    return Math.sqrt(document.getElementById("ExhaustArea").value * 4 / Math.PI);
}

function portToOutletRatio() {
    return document.getElementById("Silencer").value ? 0.72 : 0.6;
}

//Ten logarithm or natural logarithm..?
function ComputeSecondDiameter() {
    return tunedLength() * portToPipeRatio * Math.exp(
        Math.pow(tunedLength() * 0.275 / (tunedLength() * 0.275 + tunedLength() * 0.183 + tunedLength() * 0.092), hornCoefficient) *
        Math.log(portToMidSectionRatio / portToPipeRatio));
}

function ComputeThirdDiameter() {
    return tunedLength() * portToPipeRatio * Math.exp(
    Math.pow((tunedLength() * 0.275 + tunedLength() * 0.183) / (tunedLength() * 0.275 + tunedLength() * 0.183 + tunedLength() * 0.092), hornCoefficient) *
    Math.log(portToMidSectionRatio / portToPipeRatio));
}
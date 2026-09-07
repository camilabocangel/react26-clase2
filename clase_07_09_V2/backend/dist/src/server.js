"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const puerto = 3000;
app.get("/saludo", (req, res) => {
    res.send("Hola desde express");
});
app.listen(puerto, () => {
    console.log(`Servidor ejecutándose en http://localhost:${puerto}`);
});

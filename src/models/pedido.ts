import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../database/index.js";
import { Cliente } from "./cliente.js";

export class Pedido extends Model<InferAttributes<Pedido>, InferCreationAttributes<Pedido>> {
    declare id: number;
    declare clienteId: number;
    declare data: CreationOptional<Date>;
    declare status: CreationOptional<"em_preparo" | "concluido" | "pago">;
    declare total: number;
    declare caixaId: CreationOptional<number>;
}

Pedido.init(
    {
        id: {
            type: DataTypes.INTEGER, primaryKey: true,
            autoIncrement: true
        },
        clienteId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        caixaId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        data: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.ENUM("em_preparo", "concluido", "pago"),
            defaultValue: "em_preparo"
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
    },
    {
        sequelize, modelName: "Pedido",
        tableName: "pedidos",
        timestamps: false
    }
);

Pedido.belongsTo(Cliente, { foreignKey: "clienteId" });
Cliente.hasMany(Pedido, { foreignKey: "clienteId" });

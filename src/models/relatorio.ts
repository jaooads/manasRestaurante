import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../database/index";

export class Relatorio extends Model<InferAttributes<Relatorio>, InferCreationAttributes<Relatorio>> {
    declare id: number;
    declare tipo: "vendas_diarias" | "vendas_semanais" | "vendas_mensais" | "produtos_mais_vendidos" | "total_por_forma_pagamento" | "clientes_mais_frequentes";
    declare periodo: string;
    declare dados: CreationOptional<string>;
    declare dataGeracao: CreationOptional<Date>;
}

Relatorio.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tipo: {
        type: DataTypes.ENUM(
            "vendas_diarias",
            "vendas_semanais",
            "vendas_mensais",
            "produtos_mais_vendidos",
            "total_por_forma_pagamento",
            "clientes_mais_frequentes"
        ),
        allowNull: false
    },
    periodo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dados: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    dataGeracao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: "Relatorio",
    tableName: "relatorios",
    timestamps: false
});
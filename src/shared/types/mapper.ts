import { Client, ClientDataForm, EconomicExpense, EconomicExpenseDataForm, EconomicIncome, EconomicIncomeDataForm, ProductInventory, ProductInventoryDataForm, Measurement, MeasurementDataForm, User, UserDataForm } from ".";

export function mapUserToDataForm(user: User): UserDataForm {
    return {
        idUser: user.idUser,
        idRole: user.role.idRole,
        idPerson: user.person.idPerson,
        name: user.person.name,
        firstLastName: user.person.firstLastName,
        secondLastName: user.person.secondLastName,
        birthday: user.person.birthday,
        identificationNumber: user.person.identificationNumber,
        email: user.person.email,
        phoneNumber: user.person.phoneNumber,
        idGender: user.person.gender.idGender,
        username: user.username,
        isDeleted: user.isDeleted,
        password: "",
        confirmPassword: ""
    };
}

export function mapEconomicIncomeToDataForm(economicIncome: EconomicIncome): EconomicIncomeDataForm {
    return {
        idEconomicIncome: economicIncome.idEconomicIncome,
        idClient: economicIncome.client.idClient,
        registrationDate: economicIncome.registrationDate,
        voucherNumber: economicIncome.voucherNumber,
        detail: economicIncome.detail,
        idMeanOfPayment: economicIncome.meanOfPayment.idMeanOfPayment,
        amount: economicIncome.amount,
        idActivityType: economicIncome.activityType.idActivityType,
        isDeleted: economicIncome.isDeleted
    };
}

export function mapEconomicExpenseToDataForm(economicExpense: EconomicExpense): EconomicExpenseDataForm {
    return {
        idEconomicExpense: economicExpense.idEconomicExpense,
        idCategory: economicExpense.category.idCategory,
        idUser: economicExpense.user.idUser,
        registrationDate: economicExpense.registrationDate,
        voucherNumber: economicExpense.voucherNumber,
        detail: economicExpense.detail,
        idMeanOfPayment: economicExpense.meanOfPayment.idMeanOfPayment,
        amount: economicExpense.amount,
        isDeleted: economicExpense.isDeleted
    };
}

export function mapProductInventoryToDataForm(product: ProductInventory): ProductInventoryDataForm {
    return {
        idProductInventory: product.idProductInventory,
        idUser: product.user.idUser,
        code: product.code,
        name: product.name,
        cost: product.cost,
        quantity: product.quantity,
        isDeleted: product.isDeleted
    };
}

export function mapMeasurementToDataForm(measurement: Measurement): MeasurementDataForm {
    return {
        idMeasurement: measurement.idMeasurement,
        idClient: measurement.client.idClient,
        idUser: measurement.user.idUser,
        measurementDate: measurement.measurementDate,
        weight: measurement.weight,
        height: measurement.height,
        bmi: measurement.bmi,
        bodyFatPercentage: measurement.bodyFatPercentage,
        muscleMass: measurement.muscleMass,
        visceralFatPercentage: measurement.visceralFatPercentage,
        neckSize: measurement.neckSize,
        shoulderSize: measurement.shoulderSize,
        chestSize: measurement.chestSize,
        waistSize: measurement.waistSize,
        thighSize: measurement.thighSize,
        calfSize: measurement.calfSize,
        forearmSize: measurement.forearmSize,
        armSize: measurement.armSize,
        isDeleted: measurement.isDeleted
    };
}

export function mapClientToDataForm(client: Client): ClientDataForm {
    return {
        idClient: client.idClient,
        idUser: client.user.idUser,
        idTypeClient: client.typeClient.idTypeClient,
        registrationDate: client.registrationDate,
        expirationMembershipDate: client.expirationMembershipDate,
        emergencyContact: client.emergencyContact,
        signatureImage: client.signatureImage,
        idHealthQuestionnaire: client.healthQuestionnaire.idHealthQuestionnaire,
        diabetes: client.healthQuestionnaire.diabetes,
        hypertension: client.healthQuestionnaire.hypertension,
        muscleInjuries: client.healthQuestionnaire.muscleInjuries,
        boneJointIssues: client.healthQuestionnaire.boneJointIssues,
        balanceLoss: client.healthQuestionnaire.balanceLoss,
        cardiovascularDisease: client.healthQuestionnaire.cardiovascularDisease,
        breathingIssues: client.healthQuestionnaire.breathingIssues,
        isDeleted: client.isDeleted,
        idPerson: client.person.idPerson,
        name: client.person.name,
        firstLastName: client.person.firstLastName,
        secondLastName: client.person.secondLastName,
        birthday: client.person.birthday,
        identificationNumber: client.person.identificationNumber,
        email: client.person.email,
        phoneNumber: client.person.phoneNumber,
        idGender: client.person.gender.idGender
    };
}

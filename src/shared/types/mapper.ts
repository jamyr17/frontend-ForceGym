import { Client, ClientDataForm, EconomicExpense, EconomicExpenseDataForm, EconomicIncome, EconomicIncomeDataForm, ProductInventory, ProductInventoryDataForm, User, UserDataForm } from ".";

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
        gender: user.person.gender,
        username: user.username,
        isDeleted: user.isDeleted,
        password: "",
        confirmPassword: ""
    }
}

export function mapEconomicIncomeToDataForm(economicIncome: EconomicIncome): EconomicIncomeDataForm {
    return {
        idEconomicIncome: economicIncome.idEconomicIncome,
        idUser: economicIncome.user.idUser,
        registrationDate: economicIncome.registrationDate,
        voucherNumber: economicIncome.voucherNumber,
        detail: economicIncome.detail,
        idMeanOfPayment: economicIncome.meanOfPayment.idMeanOfPayment,
        amount: economicIncome.amount,
        idActivityType: economicIncome.activityType.idActivityType,
        isDeleted: economicIncome.isDeleted
    }
}

export function mapEconomicExpenseToDataForm(economicExpense: EconomicExpense): EconomicExpenseDataForm {
    return {
        idEconomicExpense: economicExpense.idEconomicExpense,
        idUser: economicExpense.user.idUser,
        registrationDate: economicExpense.registrationDate,
        voucherNumber: economicExpense.voucherNumber,
        detail: economicExpense.detail,
        idMeanOfPayment: economicExpense.meanOfPayment.idMeanOfPayment,
        amount: economicExpense.amount,
        isDeleted: economicExpense.isDeleted
    }
}

export function mapProductInventoryToDataForm(product : ProductInventory) : ProductInventoryDataForm {
    return {
        idProductInventory: product.idProductInventory,
        idUser: product.user.idUser,
        code: product.code,
        name: product.name,
        cost: product.cost,
        quantity: product.quantity,
        isDeleted: product.isDeleted
    }
}

export function mapClientToDataForm(client: Client): ClientDataForm {
    const { idClient, ...healthData } = client.healthQuestionnaire;

    return {
        idClient: client.idClient,
        idUser: client.user.idUser,
        idTypeClient: client.typeClient.idTypeClient,
        registrationDate: client.registrationDate,
        emergencyContact: client.emergencyContact,
        signatureImage: client.signatureImage,

        // HealthQuestionaire
        ...healthData,

        // Person 
        ...client.person,
    };
}

export type CredencialUser = {
    username: string
    password: string
}

export type Role = {
    idRole: number
    name: string
}

export type MeanOfPayment = {
    idMeanOfPayment: number
    name: string
}

export type ActivityType = {
    idActivityType: number
    name: string
}

export type Gender = {
    idGender: number
    name: string
}

export type Category = {
    idCategory: number
    name: string
}

export type TypeClient = {
    idTypeClient: number
    name: string
    dailyCharge: number
    weeklyCharge: number
    biweeklyCharge: number
    monthlyCharge: number
    isDeleted: number
}

export type NotificationType = {
    idNotificationType: number
    name: string
}
// -----------------------------------------------------

export type Person = {
    idPerson: number
    name: string
    firstLastName: string
    secondLastName: string
    birthday: Date
    identificationNumber: string
    email: string
    phoneNumber: string
    gender: Gender
}

export type User = {
    idUser: number
    person: Person
    role: Role
    username: string
    isDeleted: number
    token: string
}

export type UserDataForm = Pick<User, 'idUser' | 'username' | 'isDeleted'> & Pick<Role, 'idRole'> & Omit<Person, 'gender'> & {
    idGender: number
    password: string
    confirmPassword: string
}

// -----------------------------------------------------

export type EconomicIncome = {
    idEconomicIncome: number
    client: Client
    registrationDate: Date
    voucherNumber: string
    detail: string
    meanOfPayment: MeanOfPayment
    amount: number
    activityType: ActivityType
    isDeleted: number
}

export type EconomicIncomeDataForm = Omit<EconomicIncome, 'user' | 'meanOfPayment' | 'activityType' | "client"> & Pick<Client, 'idClient'> & {
    idMeanOfPayment: MeanOfPayment['idMeanOfPayment']
    idActivityType: ActivityType['idActivityType']
}

export type EconomicExpense = Omit<EconomicIncome, "activityType" | "idEconomicIncome" | "client"> & {
    user: User
    idEconomicExpense: number
    category: Category
}

export type EconomicExpenseDataForm = Omit<EconomicIncomeDataForm, 'idActivityType' | "idEconomicIncome" | "idClient"> & Omit<EconomicExpense, "meanOfPayment" | "category" | "user">
    & Pick<EconomicExpense, 'idEconomicExpense'> & {
        idUser: number
        idCategory: number
    }

// -----------------------------------------------------

export type ProductInventory = {
    idProductInventory: number
    user: User
    code: string
    name: string
    quantity: number
    cost: number
    isDeleted: number
}

export type ProductInventoryDataForm = Omit<ProductInventory, 'user'> & Pick<User, 'idUser'>
// --------------------------------------------------------
export type HealthQuestionnaire = Pick<Client, 'idClient'> & {
    idHealthQuestionnaire: number
    diabetes: boolean
    hypertension: boolean
    muscleInjuries: boolean
    boneJointIssues: boolean
    balanceLoss: boolean
    cardiovascularDisease: boolean
    breathingIssues: boolean
    isDeleted: number
}

export type Client = {
    idClient: number
    user: User
    person: Person
    typeClient: TypeClient
    healthQuestionnaire: HealthQuestionnaire
    registrationDate: Date
    expirationMembershipDate: Date
    emergencyContact: string
    nameEmergencyContact: string
    signatureImage: string
    isDeleted: number
}

export type ClientDataForm = Omit<Client, 'user' | 'person' | 'typeClient' | 'healthQuestionnaire'> & HealthQuestionnaire & Omit<Person, 'gender'> & Pick<User, 'idUser'>  & Pick<TypeClient, 'idTypeClient'> & {
    idGender: number
}

export type ClientOptions = {
    value: number
    label: string
}
// --------------------------------------------------------
export type NotificationTemplate = {
    idNotificationTemplate: number
    user: User
    message: string
    notificationType: NotificationType
    isDeleted: number
}

export type NotificationTemplateDataForm = Omit<NotificationTemplate, 'user' | 'notificationType'> & Pick<NotificationType, 'idNotificationType'> & Pick<User, 'idUser'>
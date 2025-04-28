export type CredencialUser = {
    username: string
    password: string
    recaptchaToken: string
}

export type Role = {
    idRole: number
    name: string
}

export type DifficultyRoutine = {
    idDifficultyRoutine: number;
    name: string;
};

export type MeanOfPayment = {
    idMeanOfPayment: number
    name: string
}

export type Fee = {
    idClientType: ClientType['idClientType'][]
    amount: number
}

export type ActivityType = {
    idActivityType: number
    name: string
    fees: Fee[]
    isDeleted: number
}

export type Gender = {
    idGender: number
    name: string
}

export type Category = {
    idCategory: number
    name: string
    user: User
    isDeleted: number
}
export type CategoryDataForm = Omit<Category, 'user'> & Pick<User, 'idUser'>

export type ClientType = {  
    idClientType: number
    name: string
    isDeleted: number
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

export type ExerciseCategory = {
    idExerciseCategory: number
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
    hasDelay: boolean
    delayDays: number | null
    isDeleted: number
}

export type EconomicIncomeDataForm = Omit<EconomicIncome, 'user' | 'meanOfPayment' | 'activityType' | "client"> & Pick<Client, 'idClient'> & {
    idMeanOfPayment: MeanOfPayment['idMeanOfPayment']
    idActivityType: ActivityType['idActivityType']
    hasDelay: boolean
}

export type EconomicExpense = Omit<EconomicIncome, "activityType" | "idEconomicIncome" | "client" | "delayDays"> & {
    user: User
    idEconomicExpense: number
    category: Category
}

export type EconomicExpenseDataForm = Omit<EconomicIncomeDataForm, 'idActivityType' | "idEconomicIncome" | "idClient" | "delayDays" | "hasDelay"> & Omit<EconomicExpense, "meanOfPayment" | "category" | "user">
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
    expirationMembershipDate: string | Date
    phoneNumberContactEmergency: string
    nameEmergencyContact: string
    signatureImage: string
    isDeleted: number
}
// --------------------------------------------------------
export type Measurement = {
    idClient: number
    idMeasurement: number
    client: Client
    measurementDate: Date
    weight: number
    height: number
    muscleMass: number
    bodyFatPercentage: number 
    visceralFatPercentage: number
    chestSize: number
    backSize: number
    hipSize: number
    waistSize: number
    leftLegSize: number
    rightLegSize: number
    leftCalfSize: number
    rightCalfSize: number
    leftForeArmSize: number
    rightForeArmSize: number
    leftArmSize: number
    rightArmSize: number
    isDeleted: number
}

export type MeasurementDataForm = Omit<Measurement, 'client'> & {
    idClient: number
}

export type ClientDataForm = Omit<Client, 'user' | 'person' | 'typeClient' | 'healthQuestionnaire'| 'registrationDate'> & HealthQuestionnaire & Omit<Person, 'gender'> & Pick<User, 'idUser'>  & Pick<TypeClient, 'idTypeClient'> & {
    idGender: number
    registrationDate: string | Date
}

export type ClientOptions = {
    value: number
    label: string
    idClientType: number
}
// --------------------------------------------------------
export type Exercise = {
    idExercise: number;
    name: string;
    description: string;
    difficulty: string;
    exerciseCategory: ExerciseCategory;
    paramLoggedIdUser: number;
    user: User;
    isDeleted: number;
};

export type ExerciseDataForm = Omit<Exercise, 'user' | 'exerciseCategory'> & Pick<ExerciseCategory, 'idExerciseCategory'> & Pick<User, 'idUser'>
// --------------------------------------------------------
export type NotificationTemplate = {
    idNotificationTemplate: number
    user: User
    message: string
    notificationType: NotificationType
    isDeleted: number
}

export type NotificationTemplateDataForm = Omit<NotificationTemplate, 'user' | 'notificationType'> & Pick<NotificationType, 'idNotificationType'> & Pick<User, 'idUser'>

export type ClientTypeDataForm = {
    idClientType: number;
    name: string;
    isDeleted: number; 
}


export type Routine = {
    idRoutine: number;
    name: string;
    user: User
    difficultyRoutine: DifficultyRoutine;
    isDeleted: number;
};

export type RoutineDataForm = Omit<Routine, 'user' |'difficultyRoutine'> & Pick<User, 'idUser'> & Pick<DifficultyRoutine, 'idDifficultyRoutine'>
class Program {
    constructor(programID, majorID, minorID, name, programType, requirements) {
        this.programID = programID;
        this.majorID = majorID;
        this.minorID = minorID;
        this.name = name;
        this.programType = programType;
        this.requirements = requirements;
    }

    static fromRow(row) {
        return new Program(
            row.programID,
            row.majorID,
            row.minorID,
            row.name,
            row.programType,
            row.requirements
        );
    }
}

module.exports = Program;
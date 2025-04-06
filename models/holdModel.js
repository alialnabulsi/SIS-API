class Hold {
    constructor(holdID, reason) {
        this.holdID = holdID;
        this.reason = reason;
    }

    static fromRow(row) {
        return new Hold(
            row.holdID,
            row.reason
        );
    }
}

module.exports = Hold;
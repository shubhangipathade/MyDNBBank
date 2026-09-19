package com.banking.banking_backend.service;

import java.math.BigDecimal;

public class TransferResponse {

    private String transactionReference;

    private String status;

    private BigDecimal amount;

    private BigDecimal remainingBalance;

    public TransferResponse() {
    }

    public TransferResponse(
            String transactionReference,
            String status,
            BigDecimal amount,
            BigDecimal remainingBalance) {

        this.transactionReference = transactionReference;
        this.status = status;
        this.amount = amount;
        this.remainingBalance = remainingBalance;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getRemainingBalance() {
        return remainingBalance;
    }

    public void setRemainingBalance(BigDecimal remainingBalance) {
        this.remainingBalance = remainingBalance;
    }
}
package com.banking.banking_backend.controller;

import com.banking.banking_backend.entity.Transaction;
import com.banking.banking_backend.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(
            TransactionService transactionService) {

        this.transactionService = transactionService;
    }

    @GetMapping
    public List<Transaction> getTransactions() {

        return transactionService
                .getAllTransactions();
    }
}
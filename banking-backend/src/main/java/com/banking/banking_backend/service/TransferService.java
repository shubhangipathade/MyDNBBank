package com.banking.banking_backend.service;

import com.banking.banking_backend.dto.TransferRequest;
import com.banking.banking_backend.dto.TransferResponse;
import com.banking.banking_backend.entity.Account;
import com.banking.banking_backend.entity.Beneficiary;
import com.banking.banking_backend.entity.Transaction;
import com.banking.banking_backend.exception.InsufficientBalanceException;
import com.banking.banking_backend.repository.AccountRepository;
import com.banking.banking_backend.repository.BeneficiaryRepository;
import com.banking.banking_backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransferService {

    private final AccountRepository accountRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final TransactionRepository transactionRepository;

    public TransferService(
            AccountRepository accountRepository,
            BeneficiaryRepository beneficiaryRepository,
            TransactionRepository transactionRepository) {

        this.accountRepository = accountRepository;
        this.beneficiaryRepository = beneficiaryRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public TransferResponse transferMoney(
            TransferRequest request) {

        // Find source account
        Account account = accountRepository
                .findById(request.getAccountId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Source account not found"));

        // Find beneficiary
        Beneficiary beneficiary = beneficiaryRepository
                .findById(request.getBeneficiaryId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Beneficiary not found"));

        // Check beneficiary status
        if (!beneficiary.isActive()) {
            throw new RuntimeException(
                    "Beneficiary is inactive");
        }

        // Validate amount
        if (request.getAmount() == null ||
                request.getAmount()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Amount must be greater than zero");
        }

        // Check balance
        if (account.getBalance()
                .compareTo(request.getAmount()) < 0) {

            throw new InsufficientBalanceException(
                    "Insufficient balance");
        }

        // Deduct money
        BigDecimal newBalance =
                account.getBalance()
                        .subtract(request.getAmount());

        account.setBalance(newBalance);

        accountRepository.save(account);

        // Create transaction
        Transaction transaction = new Transaction();

        transaction.setTransactionReference(
                "TXN" + System.currentTimeMillis());

        transaction.setFromAccount(
                account.getAccountNumber());

        transaction.setBeneficiaryId(
                beneficiary.getBeneficiaryId());

        transaction.setAmount(
                request.getAmount());

        transaction.setRemarks(
                request.getRemarks());

        transaction.setStatus("SUCCESS");

        transaction.setTransactionDate(
                LocalDateTime.now());

        Transaction savedTransaction =
                transactionRepository.save(transaction);

        return new TransferResponse(
                savedTransaction
                        .getTransactionReference(),
                savedTransaction.getStatus(),
                savedTransaction.getAmount(),
                newBalance
        );
    }
}
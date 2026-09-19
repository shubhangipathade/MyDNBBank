package com.banking.banking_backend.service;

import com.banking.banking_backend.entity.Account;
import com.banking.banking_backend.repository.AccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }


    // ==========================================
    // GET ALL ACCOUNTS
    // ==========================================

    public List<Account> getAllAccounts() {

        return accountRepository.findAll();
    }


    // ==========================================
    // GET ACCOUNT BY ID
    // ==========================================

    public Account getAccount(Long accountId) {

        return accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Account not found with ID: "
                                        + accountId
                        )
                );
    }


    // ==========================================
    // CREATE ACCOUNT
    // ==========================================

    public Account createAccount(
            String accountType,
            String accountNumber,
            BigDecimal balance,
            boolean primaryAccount) {

        // Validate account number
        if (accountNumber == null ||
                accountNumber.trim().isEmpty()) {

            throw new RuntimeException(
                    "Account number is required"
            );
        }


        // Validate account type
        if (accountType == null ||
                accountType.trim().isEmpty()) {

            throw new RuntimeException(
                    "Account type is required"
            );
        }


        // Validate balance
        if (balance == null) {

            balance = BigDecimal.ZERO;
        }


        if (balance.compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Initial balance cannot be negative"
            );
        }


        // Create account
        Account account = new Account();

        account.setAccountType(accountType);
        account.setAccountNumber(accountNumber);
        account.setBalance(balance);
        account.setPrimaryAccount(primaryAccount);

        // New account is ACTIVE
        account.setAccountStatus("ACTIVE");


        return accountRepository.save(account);
    }


    // ==========================================
    // CLOSE ACCOUNT
    // ==========================================
    //
    // Used when account balance is already ₹0
    //
    // ==========================================

    @Transactional
    public Account closeAccount(Long accountId) {

        Account account = getAccount(accountId);


        // Already closed
        if ("CLOSED".equalsIgnoreCase(
                account.getAccountStatus())) {

            throw new RuntimeException(
                    "Account is already closed"
            );
        }


        // Get balance
        BigDecimal balance =
                account.getBalance() == null
                        ? BigDecimal.ZERO
                        : account.getBalance();


        // Balance must be exactly zero
        if (balance.compareTo(
                BigDecimal.ZERO) != 0) {

            throw new RuntimeException(
                    "Account balance must be zero before closing"
            );
        }


        // Close account
        account.setAccountStatus("CLOSED");

        // Closed account cannot remain primary
        account.setPrimaryAccount(false);


        return accountRepository.save(account);
    }


    // ==========================================
    // TRANSFER FULL BALANCE AND CLOSE ACCOUNT
    // ==========================================
    //
    // Source account:
    //     Balance becomes ₹0
    //     Status becomes CLOSED
    //
    // Destination account:
    //     Receives complete balance
    //
    // ==========================================

    @Transactional
    public Account transferBalanceAndCloseAccount(
            Long sourceAccountId,
            Long destinationAccountId) {


        // ======================================
        // GET SOURCE ACCOUNT
        // ======================================

        Account sourceAccount =
                getAccount(sourceAccountId);


        // ======================================
        // GET DESTINATION ACCOUNT
        // ======================================

        Account destinationAccount =
                getAccount(destinationAccountId);


        // ======================================
        // CHECK SOURCE ACCOUNT STATUS
        // ======================================

        if ("CLOSED".equalsIgnoreCase(
                sourceAccount.getAccountStatus())) {

            throw new RuntimeException(
                    "Source account is already closed"
            );
        }


        // ======================================
        // CHECK DESTINATION ACCOUNT STATUS
        // ======================================

        if ("CLOSED".equalsIgnoreCase(
                destinationAccount.getAccountStatus())) {

            throw new RuntimeException(
                    "Destination account is closed"
            );
        }


        // ======================================
        // SAME ACCOUNT CHECK
        // ======================================

        if (sourceAccountId.equals(
                destinationAccountId)) {

            throw new RuntimeException(
                    "Source and destination accounts cannot be the same"
            );
        }


        // ======================================
        // GET SOURCE BALANCE
        // ======================================

        BigDecimal sourceBalance =
                sourceAccount.getBalance() == null
                        ? BigDecimal.ZERO
                        : sourceAccount.getBalance();


        // ======================================
        // NEGATIVE BALANCE CHECK
        // ======================================

        if (sourceBalance.compareTo(
                BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Account has a negative balance and cannot be closed"
            );
        }


        // ======================================
        // IF BALANCE IS ZERO
        // JUST CLOSE ACCOUNT
        // ======================================

        if (sourceBalance.compareTo(
                BigDecimal.ZERO) == 0) {

            sourceAccount.setAccountStatus(
                    "CLOSED"
            );

            sourceAccount.setPrimaryAccount(
                    false
            );

            return accountRepository.save(
                    sourceAccount
            );
        }


        // ======================================
        // GET DESTINATION BALANCE
        // ======================================

        BigDecimal destinationBalance =
                destinationAccount.getBalance() == null
                        ? BigDecimal.ZERO
                        : destinationAccount.getBalance();


        // ======================================
        // ADD FULL SOURCE BALANCE
        // TO DESTINATION ACCOUNT
        // ======================================

        destinationAccount.setBalance(
                destinationBalance.add(
                        sourceBalance
                )
        );


        // ======================================
        // SOURCE ACCOUNT BALANCE = ₹0
        // ======================================

        sourceAccount.setBalance(
                BigDecimal.ZERO
        );


        // ======================================
        // CLOSE SOURCE ACCOUNT
        // ======================================

        sourceAccount.setAccountStatus(
                "CLOSED"
        );


        // Closed account cannot be primary
        sourceAccount.setPrimaryAccount(
                false
        );


        // ======================================
        // SAVE DESTINATION ACCOUNT
        // ======================================

        accountRepository.save(
                destinationAccount
        );


        // ======================================
        // SAVE SOURCE ACCOUNT
        // ======================================

        return accountRepository.save(
                sourceAccount
        );
    }


    // ==========================================
    // REMOVE ACCOUNT
    // ==========================================
    //
    // Only CLOSED accounts can be removed
    //
    // ==========================================

    @Transactional
    public void removeAccount(Long accountId) {

        Account account =
                getAccount(accountId);


        // ======================================
        // ONLY CLOSED ACCOUNT CAN BE REMOVED
        // ======================================

        if (!"CLOSED".equalsIgnoreCase(
                account.getAccountStatus())) {

            throw new RuntimeException(
                    "Only closed accounts can be removed"
            );
        }


        // ======================================
        // SAFETY CHECK
        // ======================================
        //
        // Closed account should have zero balance
        //
        // ======================================

        BigDecimal balance =
                account.getBalance() == null
                        ? BigDecimal.ZERO
                        : account.getBalance();


        if (balance.compareTo(
                BigDecimal.ZERO) != 0) {

            throw new RuntimeException(
                    "Closed account must have zero balance before removal"
            );
        }


        // ======================================
        // DELETE ACCOUNT
        // ======================================

        accountRepository.delete(account);
    }
}
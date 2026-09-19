package com.banking.banking_backend.controller;

import com.banking.banking_backend.entity.Account;
import com.banking.banking_backend.service.AccountService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:5173")
public class AccountController {

    private final AccountService accountService;


    public AccountController(
            AccountService accountService) {

        this.accountService = accountService;
    }


    // ==========================================
    // GET ALL ACCOUNTS
    // ==========================================

    @GetMapping
    public List<Account> getAccounts() {

        System.out.println(
                "========== GET /api/accounts =========="
        );

        return accountService.getAllAccounts();
    }


    // ==========================================
    // CREATE ACCOUNT
    // ==========================================

    @PostMapping
    public Account createAccount(
            @RequestBody CreateAccountRequest request) {

        System.out.println(
                "========== POST /api/accounts =========="
        );


        return accountService.createAccount(
                request.accountType,
                request.accountNumber,
                request.balance,
                request.primaryAccount
        );
    }


    // ==========================================
    // CLOSE ACCOUNT
    // ==========================================
    //
    // This endpoint is used only when
    // balance is already ₹0.
    //
    // ==========================================

    @PutMapping("/{accountId}/close")
    public Account closeAccount(
            @PathVariable Long accountId) {

        System.out.println(
                "========== CLOSE ACCOUNT =========="
        );

        System.out.println(
                "Account ID: " + accountId
        );


        return accountService.closeAccount(
                accountId
        );
    }


    // ==========================================
    // TRANSFER BALANCE + CLOSE ACCOUNT
    // ==========================================
    //
    // Example:
    //
    // PUT
    // /api/accounts/1/close-and-transfer/2
    //
    // Account 1 → Account 2
    //
    // Account 1 becomes CLOSED
    //
    // ==========================================

    @PutMapping(
            "/{sourceAccountId}/close-and-transfer/{destinationAccountId}"
    )
    public Account transferBalanceAndCloseAccount(

            @PathVariable Long sourceAccountId,

            @PathVariable Long destinationAccountId) {


        System.out.println(
                "========== TRANSFER BALANCE + CLOSE =========="
        );


        System.out.println(
                "Source Account ID: "
                        + sourceAccountId
        );


        System.out.println(
                "Destination Account ID: "
                        + destinationAccountId
        );


        return accountService
                .transferBalanceAndCloseAccount(
                        sourceAccountId,
                        destinationAccountId
                );
    }


    // ==========================================
    // REMOVE CLOSED ACCOUNT
    // ==========================================
    //
    // DELETE
    // /api/accounts/{accountId}
    //
    // Only CLOSED accounts can be removed.
    //
    // ==========================================

    @DeleteMapping("/{accountId}")
    public void removeAccount(
            @PathVariable Long accountId) {

        System.out.println(
                "========== REMOVE ACCOUNT =========="
        );


        System.out.println(
                "Account ID: " + accountId
        );


        accountService.removeAccount(
                accountId
        );
    }


    // ==========================================
    // CREATE ACCOUNT REQUEST
    // ==========================================

    public static class CreateAccountRequest {

        public String accountType;

        public String accountNumber;

        public BigDecimal balance;

        public boolean primaryAccount;
    }
}
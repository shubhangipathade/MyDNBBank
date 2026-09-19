package com.banking.banking_backend.controller;

import com.banking.banking_backend.dto.TransferRequest;
import com.banking.banking_backend.dto.TransferResponse;
import com.banking.banking_backend.service.TransferService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transfers")
@CrossOrigin(origins = "http://localhost:5173")
public class TransferController {

    private final TransferService transferService;

    public TransferController(
            TransferService transferService) {

        this.transferService = transferService;
    }

    @PostMapping
    public TransferResponse transfer(
            @RequestBody TransferRequest request) {

        return transferService.transferMoney(request);
    }
}
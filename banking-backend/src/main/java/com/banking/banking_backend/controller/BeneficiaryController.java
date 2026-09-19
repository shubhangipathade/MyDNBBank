package com.banking.banking_backend.controller;

import com.banking.banking_backend.entity.Beneficiary;
import com.banking.banking_backend.service.BeneficiaryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beneficiaries")
@CrossOrigin(origins = "http://localhost:5173")
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    public BeneficiaryController(
            BeneficiaryService beneficiaryService) {

        this.beneficiaryService = beneficiaryService;
    }

    @GetMapping
    public List<Beneficiary> getBeneficiaries() {

        return beneficiaryService
                .getAllBeneficiaries();
    }
}
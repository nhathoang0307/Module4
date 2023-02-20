package com.cg.api;
import com.cg.model.dto.CustomerDTO;
import com.cg.service.customer.ICustomerService;
import com.cg.utils.AppUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/customers")

public class CustomerAPI {
    @Autowired
    private ICustomerService customerService;

    @Autowired
    private AppUtils appUtils;

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {

        List<CustomerDTO> customerDTOS = customerService.findALlCustomerDTO();

        return new ResponseEntity<>(customerDTOS, HttpStatus.OK);
    }
}

package com.cg.repository;

import com.cg.model.Customer;
import com.cg.model.dto.CustomerDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;


@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> findAllByIdNot(Long id);

    List<Customer> findAllByDeletedIsFalse();


    @Query("SELECT NEW com.cg.model.dto.CustomerDTO (" +
                "c.id, " +
                "c.fullName, " +
                "c.email, " +
                "c.phone, " +
                "c.balance, " +
                "c.locationRegion" +
            ") " +
            "FROM Customer AS c " +
            "WHERE c.deleted = FALSE "
    )
    List<CustomerDTO> findAllCustomerDTOByDeletedIsFalse();


    @Modifying
    @Query("UPDATE Customer AS c " +
            "SET c.balance = c.balance + :transactionAmount " +
            "WHERE c.id = :customerId"
    )
    void incrementBalance(@Param("customerId") Long customerId, @Param("transactionAmount") BigDecimal transactionAmount);


    @Modifying
    @Query("UPDATE Customer AS c " +
            "SET c.balance = c.balance - :transactionAmount " +
            "WHERE c.id = :customerId"
    )
    void deIncrementBalance(@Param("customerId") Long customerId, @Param("transactionAmount") BigDecimal transactionAmount);
}

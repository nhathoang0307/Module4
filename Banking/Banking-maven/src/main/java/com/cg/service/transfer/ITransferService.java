package com.cg.service.transfer;

import com.cg.model.Transfer;
import com.cg.service.IGeneralService;

import java.math.BigDecimal;
import java.util.List;

public interface ITransferService extends IGeneralService<Transfer> {
     List<Transfer> findALl();

     BigDecimal getSumFeesAmount();


}

package com.example.Warehouses.Helper;

import lombok.Getter;

@Getter
public class NodeDistance {
   private final Long warehouseId;
   private final Double distance;
    public NodeDistance(Long warehouseId,Double distance){
        this.warehouseId=warehouseId;
        this.distance=distance;
    }
}

package ru.artemiyandstepan;

import java.util.List;

public class ResponseByPages<T> {
    private List<T> items;
    private int totalItems;
    private int currentPage;
    private int pageSize;

    public ResponseByPages(List<T> items, int totalItems, int currentPage, int pageSize) {
        this.items = items;
        this.totalItems = totalItems;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
    }

    public List<T> getItems() {
        return items;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }
}

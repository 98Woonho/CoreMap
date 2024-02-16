package com.coremap.demo.regexes;

public enum CommentRegex implements Regex {
    CONTENT("^(?=.{1,1000}$)(.*)(.*)$");

    public final String expression;

    CommentRegex(String expression) {
        this.expression = expression;
    }

    @Override
    public boolean matches(String input) {
        return input != null && input.matches(this.expression);
    }
}

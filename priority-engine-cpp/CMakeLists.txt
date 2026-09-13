cmake_minimum_required(VERSION 3.16)
project(priority_engine LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(priority_engine
    main.cpp
    priority_queue_engine.cpp
    priority_queue_engine.h
)

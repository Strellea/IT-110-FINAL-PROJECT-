<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TimelineController;
use App\Http\Controllers\CollectionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/timeline', function () {
    return Inertia::render('Timeline');
})->name('timeline');

// API endpoints (using Laravel backend to avoid CORS)
Route::prefix('api')->group(function () {
    Route::get('/artworks/period/{period}', [TimelineController::class, 'getByPeriod']);
    Route::get('/artworks/{id}', [TimelineController::class, 'getById']);
    
    // Collection endpoints (require auth)
    Route::middleware('auth')->group(function () {
        Route::get('/collection', [CollectionController::class, 'index']);
        Route::post('/collection', [CollectionController::class, 'store']);
        Route::delete('/collection/{artworkId}', [CollectionController::class, 'destroy']);
        Route::get('/collection/check/{artworkId}', [CollectionController::class, 'check']);
    });
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Collection page
Route::get('/collection', function () {
    return Inertia::render('Collection');
})->middleware(['auth', 'verified'])->name('collection');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TimelineController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CollectionController;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/timeline', function () {
    return Inertia::render('Timeline');
})->name('timeline');

// If you want to add API endpoints for the Met Museum (optional, for caching)
Route::prefix('api')->group(function () {
    Route::get('/artworks/period/{period}', [TimelineController::class, 'getByPeriod']);
    Route::get('/artworks/{id}', [TimelineController::class, 'getById']);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
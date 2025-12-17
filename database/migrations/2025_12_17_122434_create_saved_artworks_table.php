<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('saved_artworks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->bigInteger('artwork_id'); // Met Museum object ID
            $table->string('title');
            $table->string('artist')->nullable();
            $table->string('year')->nullable();
            $table->text('image')->nullable();
            $table->string('period')->nullable();
            $table->string('medium')->nullable();
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            
            // Prevent duplicate saves
            $table->unique(['user_id', 'artwork_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_artworks');
    }
};
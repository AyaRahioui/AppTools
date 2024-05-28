<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRemindersTable extends Migration
{
    public function up(): void
    {
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('activity_id');
            $table->date('date');
            $table->unsignedBigInteger('result_id')->nullable();
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('activity_id')->references('id')->on('activities')->onDelete('cascade');
            $table->foreign('result_id')->references('result_id')->on('activities')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
}

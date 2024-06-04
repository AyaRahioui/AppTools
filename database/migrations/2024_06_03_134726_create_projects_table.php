<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->enum('nom', ['Wash', 'Dev_rural','Dev_communautaire', 'Charité','Aménagement','Education','Santé']);
            $table->string('date');
            $table->string('activity');
            $table->string('nb_init');
            $table->string('nb_beneficiary');
            $table->string('photo');
            $table->string('pdf');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('projects');
    }
}


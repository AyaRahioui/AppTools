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
            $table->enum('name', ['Wash', 'Dev_rural','Dev_communautaire', 'Charité','Aménagement','Education','Santé','Autre']);
            $table->string('date');
            $table->string('zi');
            $table->string('activity');
            $table->string('nb_init');
            $table->string('nbBeneficiaryTotal');
            $table->string('nbBeneficiaryM');
            $table->string('nbBeneficiaryF');
            $table->text('pdf')->nullable(); // Change data type to text
            $table->json('imgs')->nullable();
            $table->string('description')->nullable();
            $table->string('observation')->nullable();
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


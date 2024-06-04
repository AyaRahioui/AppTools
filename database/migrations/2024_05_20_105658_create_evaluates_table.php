<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluates', function (Blueprint $table) {
            $table->id();
            $table->string('codeRes');
            $table->string('label');
            $table->text('descriptif');
            $table->string('actor');
            $table->string('plan')->nullable();
            $table->text('pdf')->nullable(); // Change data type to text
            $table->json('imgs')->nullable();
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
        Schema::dropIfExists('evaluates');
    }
}

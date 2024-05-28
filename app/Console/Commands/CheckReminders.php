<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Activity;
use Carbon\Carbon;

class CheckReminders extends Command
{
    protected $signature = 'reminders:check';
    protected $description = 'Check due reminders';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $now = Carbon::now();
        $activities = Activity::where('dueDate', '<=', $now)->get();

        foreach ($activities as $activity) {
            // Here you could send notifications or perform any other action
            // For example, setting a 'reminder' flag
            $activity->reminder = true;
            $activity->save();
        }

        return 0;
    }
}

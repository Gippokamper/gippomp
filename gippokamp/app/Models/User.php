<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\GenderType;
use App\Enums\ProfessionType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'firstname',
        'lastname',
        'phone',
        'email',
        'gender',
        'profession',
        'graduation_year',
        'university_id',
        'interests',
        'birthday',
        'verification_code',
        'phone_verified_at',
        'region_id',
        'province',
        'address',
        'password',
        'image',
        'status',
        'reset_password_token',
        'verification_attempts',
        'verification_code_expires_at',
        'trial_ends_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'phone_verified_at' => 'datetime',
        'birthday' => 'datetime',
        'gender' => GenderType::class,
        'profession' => ProfessionType::class,
    ];

    public function getRoleAttribute() {
        return $this->roles[0]->name ?? 'no role';
    }

    public function getProfessionValueAttribute() {
        return $this->attributes['profession']->value ?? 'null';
    }

    public function getGenderValueAttribute() {
        return $this->attributes['gender']->value ?? 'null';
    }

    public function setPasswordAttribute($password){
        $this->attributes['password'] = Hash::make($password);
    }

    public function devices()
    {
        return $this->hasMany(Device::class);
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    /**
     * Foydalanuvchi balansi — yagona manba: wallets.amount.
     * ("balance" nomli ustun bazada yo'q, shuning uchun accessor orqali beriladi.)
     */
    public function getBalanceAttribute()
    {
        return $this->wallet?->amount ?? 0;
    }

    /**
     * Balansni atomik to'ldirish (to'lov tushganda).
     */
    public function credit(float $amount): void
    {
        $wallet = $this->wallet()->firstOrCreate(['user_id' => $this->id]);
        $wallet->increment('amount', $amount);
        $this->unsetRelation('wallet');
    }

    /**
     * Balansdan atomik yechish (to'lov bekor qilinganda / xarid).
     */
    public function debit(float $amount): void
    {
        $wallet = $this->wallet()->firstOrCreate(['user_id' => $this->id]);
        $wallet->decrement('amount', $amount);
        $this->unsetRelation('wallet');
    }

    public function university()
    {
        return $this->belongsTo(University::class);
    }

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function isPhoneVerified()
    {
        return $this->phone_verified_at !== null;
    }

    public function onTrial()
    {
        return now()->lessThan($this->trial_ends_at);
    }

    public function tariffs()
    {
        return $this->belongsToMany(Tariff::class, 'user_tariffs', 'user_id','tariff_id')
            ->with('term')
            ->withPivot('start_date')
            ->withPivot('end_date');
    }
    public function actualTariff()
    {
        return $this->tariffs()->wherePivot('start_date', '<', now())->wherePivot('end_date', '>', now())->first();
    }
    public function actualTariffs()
    {
        return $this->tariffs()->wherePivot('start_date', '<', now())->wherePivot('end_date', '>', now())->get();
    }

    public function hasActiveTariff(): bool
    {
        // Проверка на наличие активного тарифа. Это пример, и реализация может отличаться в зависимости от вашей структуры данных
        return $this->tariffs()->wherePivot('start_date', '<', now())->wherePivot('end_date', '>', now())->exists();
    }

//    protected function role(): Attribute
//    {
//        return Attribute::make(
//            get: fn (string $value) => $this->roles[0]->name,
//        );
//    }

}

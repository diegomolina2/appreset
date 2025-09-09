
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../contexts/AppContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Settings as SettingsIcon, Save, User, Ruler, Weight, Calendar, Globe, Download, Upload, RefreshCw, Crown, Clock } from 'lucide-react';
import { DailyWeightLogger } from '../components/DailyWeightLogger';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/dialog';
import { CSVImport } from '../components/CSVImport';
import { exportAllDataAsCSV } from '../utils/csvExport';
import { resetProgressData } from '../utils/progressCalculations';
import { clearUserData } from '../utils/storage';
import { Badge } from '../components/ui/badge';

export default function Settings() {
  const { t } = useTranslation();
  const { state, updateUserProfile } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    sex: '',
    activityLevel: '',
    goal: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  // Plan system removed - no longer needed

  // Plan system removed

  useEffect(() => {
    // Load existing user data from localStorage and state
    const savedUserData = localStorage.getItem('userData');
    let userData = state.userData;
    
    if (savedUserData) {
      try {
        const parsedData = JSON.parse(savedUserData);
        userData = { ...userData, ...parsedData };
      } catch (error) {
        console.error('Error parsing saved user data:', error);
      }
    }
    
    // Also check userProfile from state for onboarding data
    const userProfile = state.userData?.userProfile;
    
    setFormData({
      name: userData.name || userProfile?.name || '',
      age: userData.age?.toString() || userProfile?.age?.toString() || '',
      weight: userData.weight?.toString() || userProfile?.weight?.toString() || '',
      height: userData.height?.toString() || userProfile?.height?.toString() || '',
      sex: userData.sex || userProfile?.gender || '',
      activityLevel: userData.activityLevel || userProfile?.exerciseLevel || '',
      goal: userData.goal || userProfile?.goal || ''
    });
  }, [state.userData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedData = {
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        sex: formData.sex,
        activityLevel: formData.activityLevel,
        goal: formData.goal
      };
      
      // Save to context
      updateUserProfile(updatedData);
      
      // Save to localStorage for persistence
      const existingData = localStorage.getItem('userData');
      let userData = {};
      if (existingData) {
        try {
          userData = JSON.parse(existingData);
        } catch (error) {
          console.error('Error parsing existing user data:', error);
        }
      }
      
      const mergedData = { ...userData, ...updatedData };
      localStorage.setItem('userData', JSON.stringify(mergedData));
      
      // Show success message (you can integrate with your toast system)
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      resetProgressData();
      clearUserData();
      // Plan deactivation removed
      alert('All data has been reset successfully!');
      window.location.reload();
    }
  };

  // Plan management functions removed

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-poppins font-bold text-gray-800 dark:text-gray-100">
                {t('settings.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('settings.profile')}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Language Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t('settings.language')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LanguageSwitcher />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {t('settings.profile')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">{t('onboarding.fields.name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={t('onboarding.fields.namePlaceholder')}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">{t('onboarding.fields.age')}</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder={t('onboarding.fields.agePlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="sex">{t('onboarding.fields.gender')}</Label>
                <Select value={formData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('onboarding.fields.gender')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('onboarding.fields.genderOptions.male')}</SelectItem>
                    <SelectItem value="female">{t('onboarding.fields.genderOptions.female')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              {t('onboarding.fields.height')} & {t('onboarding.fields.weight')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">{t('onboarding.fields.targetWeight')}</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder={t('onboarding.fields.targetWeightPlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="height">{t('onboarding.fields.height')}</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder={t('onboarding.fields.heightPlaceholder')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Weight className="w-5 h-5" />
              {t('progress.weightProgress')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DailyWeightLogger />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t('onboarding.fields.exerciseLevel')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="activityLevel">{t('onboarding.fields.exerciseLevel')}</Label>
              <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange('activityLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('onboarding.fields.exerciseLevel')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">{t('onboarding.fields.exerciseOptions.sedentary')}</SelectItem>
                  <SelectItem value="moderate">{t('onboarding.fields.exerciseOptions.moderate')}</SelectItem>
                  <SelectItem value="active">{t('onboarding.fields.exerciseOptions.active')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="goal">{t('onboarding.fields.diet')}</Label>
              <Select value={formData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('onboarding.fields.diet')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Perder Peso</SelectItem>
                  <SelectItem value="maintain">Manter Peso</SelectItem>
                  <SelectItem value="gain">Ganhar Peso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              {t('progress.exportData')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => exportAllDataAsCSV(state.userData)}
                variant="outline"
                className="w-full text-green-600 hover:text-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                {t('progress.exportData')}
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Importar Dados CSV
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <CSVImport />
                </DialogContent>
              </Dialog>
              
              <Button
                onClick={handleResetData}
                variant="outline"
                className="w-full text-red-600 hover:text-red-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Resetar Dados
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full bg-primary hover:bg-primary/90"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? t('common.loading') : t('common.save')}
        </Button>
      </div>
    </div>
  );
}

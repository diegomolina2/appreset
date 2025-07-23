import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { ArrowLeft, Play, CheckCircle2, Clock, Video, FileText } from 'lucide-react';
import coursesData from '../data/courses.json';
import { Course, CourseProgress } from '../types';
import { RouteComponentProps } from 'wouter';
import { useTranslation } from '../hooks/useTranslation';
const courses = coursesData as Course[];
interface CourseDetailsPageProps {
  courseId: string;
}
export default function CourseDetails({ params }: RouteComponentProps<{ id: string }>) {
  const courseId = params.id;
  const { state, dispatch } = useApp();
  const { t, currentLanguage } = useTranslation();

  const course = courses.find(c => c.id === courseId);
  const progress = state.userData.courseProgress.find(p => p.courseId === courseId);
  
  // Calculate total lessons dynamically
  const totalLessons = course ? course.modules.reduce((total, module) => total + module.lessons.length, 0) : 0;
  if (!course) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
        <Button onClick={() => window.location.hash = '#/courses'}>
          Voltar aos Cursos
        </Button>
      </div>
    );
  }
  const startCourse = () => {
    if (!progress) {
      const newProgress: CourseProgress = {
        courseId: course.id,
        completedLessons: [],
        currentModule: course.modules[0].id,
        currentLesson: course.modules[0].lessons[0].id,
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString()
      };
      dispatch({
        type: 'SET_USER_DATA',
        payload: {
          ...state.userData,
          courseProgress: [...state.userData.courseProgress, newProgress]
        }
      });
    }
    // Navigate to first lesson
    const firstModule = course.modules[0];
    const firstLesson = firstModule.lessons[0];
    window.location.hash = `#/lesson/${course.id}/${firstModule.id}/${firstLesson.id}`;
  };
  const continueCourse = () => {
    if (!progress) return;

    window.location.hash = `#/lesson/${course.id}/${progress.currentModule}/${progress.currentLesson}`;
  };
  const goToLesson = (moduleId: string, lessonId: string) => {
    window.location.hash = `#/lesson/${course.id}/${moduleId}/${lessonId}`;
  };
  const isLessonCompleted = (lessonId: string) => {
    return progress?.completedLessons.includes(lessonId) || false;
  };
  const getModuleProgress = (moduleId: string) => {
    const module = course.modules.find(m => m.id === moduleId);
    if (!module || !progress) return 0;

    const completedInModule = module.lessons.filter(lesson => 
      progress.completedLessons.includes(lesson.id)
    ).length;

    return Math.round((completedInModule / module.lessons.length) * 100);
  };
  const totalProgress = progress 
    ? Math.round((progress.completedLessons.length / totalLessons) * 100)
    : 0;
  return (
    <div className="p-4 space-y-6">
      <Button
        variant="ghost"
        onClick={() => window.location.hash = '#/courses'}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar aos Cursos
      </Button>
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {course.title[currentLanguage] || course.title['en-NG']}
          </h1>
          <p className="text-muted-foreground mb-4">
            {course.description[currentLanguage] || course.description['en-NG']}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {totalLessons} {t('courses.lessons')}
            </div>
            {progress && (
              <div>
                {t('courses.progress')}: {totalProgress}%
              </div>
            )}
          </div>
          <Button onClick={progress ? continueCourse : startCourse} size="lg" className="w-full">
            <Play className="w-4 h-4 mr-2" />
            {progress ? 'Continuar Curso' : 'Começar Curso'}
          </Button>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Módulos do Curso</h2>

          <Accordion type="multiple" className="space-y-2">
            {course.modules.map((module) => (
              <AccordionItem key={module.id} value={module.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full mr-4">
                    <span className="font-medium">
                      {module.title[currentLanguage] || module.title['en-NG']}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{getModuleProgress(module.id)}%</span>
                      <span>({module.lessons.length} {t('courses.lessons')})</span>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="space-y-2">
                  {module.lessons.map((lesson) => {
                    const isCompleted = isLessonCompleted(lesson.id);

                    return (
                      <Card 
                        key={lesson.id} 
                        className={`cursor-pointer hover:bg-accent transition-colors ${
                          isCompleted ? 'bg-green-50 dark:bg-green-950' : ''
                        }`}
                        onClick={() => goToLesson(module.id, lesson.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {lesson.type === 'video' ? (
                                  <Video className="w-4 h-4 text-blue-500" />
                                ) : (
                                  <FileText className="w-4 h-4 text-green-500" />
                                )}
                                {isCompleted && (
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                )}
                              </div>

                              <div>
                                <h4 className="font-medium">
                                  {lesson.title[currentLanguage] || lesson.title['en-NG']}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {lesson.duration}
                                </p>
                              </div>
                            </div>

                            <Button variant="ghost" size="sm">
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
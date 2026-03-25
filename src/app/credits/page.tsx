import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Credits | SignLex",
  description:
    "Acknowledgments for the datasets, references, and tooling that make SignLex possible.",
};

type Source = {
  name: string;
  detail: string;
  href?: string;
};

type Section = {
  heading: string;
  blurb: string;
  sources: Source[];
};

const sections: Section[] = [
  {
    heading: "Sign reference & lesson imagery",
    blurb:
      "Lesson visuals — fingerspelling charts, alphabet animations, and vocabulary signs — come from Dr. Bill Vicars and the ASL University curriculum, used here for educational purposes.",
    sources: [
      {
        name: "Lifeprint — ASL University",
        detail:
          "Alphabet GIFs, greetings, family signs, and number references across all lessons.",
        href: "https://www.lifeprint.com/",
      },
    ],
  },
  {
    heading: "Training datasets",
    blurb:
      "The gesture recognition model was trained on a combination of publicly available ASL datasets covering raw images, processed crops, and skeleton-based representations.",
    sources: [
      {
        name: "ASL Alphabet Dataset",
        detail: "Static A–Z hand sign images used as the primary training base.",
      },
      {
        name: "ASL Hand Gesture Dataset (Raw & Processed)",
        detail:
          "Raw and pre-processed hand gesture variants for additional class coverage.",
      },
      {
        name: "Mendeley 210k ASL Dataset",
        detail:
          "Multi-type gesture set including raw gestures, keypoint-based, skeleton overlay, isolated skeleton, and enhanced skeleton variants.",
      },
      {
        name: "Sign Language MNIST",
        detail:
          "Grayscale 28×28 alphabet samples (excluding J and Z due to motion), converted to RGB during preprocessing.",
      },
      {
        name: "SignAlphaSet",
        detail: "Static alphabet captures used for additional generalization.",
      },
    ],
  },
  {
    heading: "Audio",
    blurb:
      "Some sound effects and audio cues used throughout the lesson interface were sourced from across the open web. Where original creators could not be identified, we extend our gratitude to the internet community at large for making these resources freely shareable.",
    sources: [
      {
        name: "The Internet",
        detail:
          "For the countless creators whose audio contributions enrich open educational tools — thank you.",
      },
    ],
  },
  {
    heading: "Models, frameworks & tooling",
    blurb:
      "SignLex is built on top of open-source machine learning research and modern web infrastructure.",
    sources: [
      {
        name: "Vision Transformer (ViT)",
        detail:
          "Backbone architecture used for the gesture classification model.",
      },
      {
        name: "PyTorch",
        detail: "Training framework and inference runtime.",
      },
      {
        name: "Pillow, NumPy, pandas, tqdm",
        detail: "Image processing and data pipeline utilities.",
      },
      {
        name: "Next.js & React",
        detail: "Frontend framework powering the SignLex application.",
      },
    ],
  },
];

const Page = () => {
  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        {/* Header */}
        <header className="mb-16">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            Acknowledgments
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Credits
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
            SignLex stands on the work of educators, researchers, and open-source
            contributors. This page acknowledges the people and projects whose
            efforts make this platform possible.
          </p>
        </header>

        {/* Sections */}
        <div className="space-y-14">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-3 text-base font-semibold tracking-tight">
                {section.heading}
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {section.blurb}
              </p>

              <ul className="divide-y divide-neutral-200 border-t border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                {section.sources.map((source) => (
                  <li key={source.name} className="py-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {source.name}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                          {source.detail}
                        </p>
                      </div>
                      {source.href && (
                        <a
                          href={source.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-xs font-medium text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:text-neutral-100"
                        >
                          Visit ↗
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Footer note */}
        <footer className="mt-20 border-t border-neutral-200 pt-8 dark:border-neutral-800">
          <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            If you are a creator or maintainer whose work appears here and would
            like attribution adjusted — added, corrected, or removed — please{" "}
            <a
              href="mailto:rshrestha3@mcneese.edu"
              className="underline underline-offset-4 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              get in touch
            </a>
            . SignLex is a non-commercial educational project built with
            gratitude toward the open knowledge community.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Page;
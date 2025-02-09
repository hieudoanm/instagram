import { useMutation } from '@tanstack/react-query';
import { NextPage } from 'next';
import { ChangeEvent, useState } from 'react';

const downloadImage = async (
  imageUrl: string,
  filename = 'downloaded-image.jpg'
) => {
  const blob: Blob = await fetch(imageUrl).then((response) => response.blob());
  const link: HTMLAnchorElement = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const HomePage: NextPage = () => {
  const [{ url, images }, setState] = useState<{
    url: string;
    images: string[];
  }>({
    url: 'https://www.instagram.com/p/DFijU7Gzkae',
    images: [],
  });

  const mutation = useMutation<{ images: string[] }, Error, string>({
    mutationFn: (url: string) => {
      return fetch('http://localhost:8080/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      }).then(async (response) => response.json());
    },
  });

  return (
    <>
      <nav className="border-b border-gray-300">
        <div className="container mx-auto p-4">
          <div className="flex items-center gap-x-4">
            <h1 className="text-xl">Instagram</h1>
            <form
              className="flex grow items-center overflow-hidden rounded border border-black border-gray-300"
              onSubmit={async (event) => {
                event.preventDefault();
                setState((previous) => ({ ...previous, images: [] }));
                const response = await mutation.mutateAsync(url);
                const { images } = response;
                setState((previous) => ({ ...previous, images }));
              }}>
              <input
                id="url"
                name="url"
                placeholder="URL"
                className="grow px-2 py-1"
                value={url}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setState((previous) => ({
                    ...previous,
                    url: event.target.value,
                  }))
                }
                required
              />
              <button
                type="submit"
                className="h-full w-16 bg-gray-300 px-2 py-1 text-black">
                Query
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main>
        <div className="container mx-auto p-4">
          {mutation.isPending && (
            <div>
              <p className="text-center">Loading</p>
            </div>
          )}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {images.map((image) => {
                return (
                  <div
                    key={image}
                    className="col-span-1 flex flex-col gap-y-1 overflow-hidden rounded border border-gray-300 p-1">
                    <div
                      className="aspect-square w-full rounded bg-contain bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${image})` }}
                    />
                    <button
                      type="button"
                      className="w-full rounded bg-black py-1 text-sm text-white"
                      onClick={() => {
                        downloadImage(image);
                      }}>
                      Download
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default HomePage;

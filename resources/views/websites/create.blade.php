  <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div class="p-6 bg-white border-b border-gray-200">
                  <form action="{{ route('websites.store') }}" method="POST">
                      @csrf
                      <div class="mb-4">
                          <label>Name</label>
                          <input type="text" name="name" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm" required>
                      </div>

                      <div class="mb-4">
                          <label>URL</label>
                          <input type="url" name="url" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm" required>
                      </div>

                      <div class="flex items-center">
                          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Add Website</button>
                          <a href="{{ route('websites.index') }}" class="ml-4">Cancel</a>
                      </div>
                  </form>
              </div>
          </div>
      </div>
  </div>

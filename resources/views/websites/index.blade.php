  <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div class="p-6 bg-white border-b border-gray-200">
                  <div class="flex justify-between mb-4">
                      <h2 class="text-xl">My Websites</h2>
                      <a href="{{ route('websites.create') }}" class="bg-blue-500 text-white px-4 py-2 rounded">Add Website</a>
                  </div>

                  <table class="min-w-full">
                      <thead>
                          <tr>
                              <th class="text-left">Name</th>
                              <th class="text-left">URL</th>
                              <th class="text-left">Status</th>
                              <th class="text-left">Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          @foreach($websites as $website)
                              <tr>
                                  <td class="py-2">{{ $website->name }}</td>
                                  <td>{{ $website->url }}</td>
                                  <td>{{ $website->is_online ? 'Online' : 'Offline' }}</td>
                                  <td>
                                      <form action="{{ route('websites.destroy', $website) }}" method="POST">
                                          @csrf
                                          @method('DELETE')
                                          <button type="submit" class="text-red-500">Remove</button>
                                      </form>
                                  </td>
                              </tr>
                          @endforeach
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  </div>
